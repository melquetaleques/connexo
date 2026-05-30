package service

import (
	"context"
	"encoding/json"
	"fmt"

	"app/api/internal/repository"
	"github.com/google/uuid"
)

// LinkService encapsula a lógica de negócio de vínculos entre clientes e contadores.
type LinkService struct {
	linkRepo          *repository.LinkRepository
	notificationRepo  *repository.NotificationRepository
	userRepo          *repository.UserRepository
	processEventsRepo *repository.ProcessEventsRepository
	lgpdRepo          *repository.LGPDRepository
}

// NewLinkService cria uma nova instância de LinkService.
func NewLinkService(
	linkRepo *repository.LinkRepository,
	notificationRepo *repository.NotificationRepository,
	userRepo *repository.UserRepository,
	processEventsRepo *repository.ProcessEventsRepository,
	lgpdRepo *repository.LGPDRepository,
) *LinkService {
	return &LinkService{
		linkRepo:          linkRepo,
		notificationRepo:  notificationRepo,
		userRepo:          userRepo,
		processEventsRepo: processEventsRepo,
		lgpdRepo:          lgpdRepo,
	}
}

// RequestLink cria um novo vínculo pendente ("solicitado") e notifica o contador.
func (s *LinkService) RequestLink(ctx context.Context, clientID, accountantID uuid.UUID) error {
	// 1. Verificar se o cliente e o contador existem
	client, err := s.userRepo.GetByID(ctx, clientID)
	if err != nil {
		return err
	}
	if client == nil {
		return fmt.Errorf("cliente %s não encontrado", clientID)
	}

	accountant, err := s.userRepo.GetByID(ctx, accountantID)
	if err != nil {
		return err
	}
	if accountant == nil {
		return fmt.Errorf("contador %s não encontrado", accountantID)
	}

	// 2. Verificar se já existe um vínculo
	existing, err := s.linkRepo.FindByClientAndAccountant(ctx, clientID, accountantID)
	if err != nil {
		return err
	}

	var link *repository.Link
	if existing != nil {
		link = existing
		link.Status = "solicitado"
		err = s.linkRepo.Update(ctx, link)
	} else {
		link = &repository.Link{
			ClientID:     clientID,
			AccountantID: accountantID,
			Status:       "solicitado",
		}
		err = s.linkRepo.Create(ctx, link)
	}
	if err != nil {
		return err
	}

	// 3. Notificar o contador
	notification := &repository.Notification{
		UserID:  accountantID,
		Title:   "Nova Solicitação de Vínculo",
		Message: fmt.Sprintf("O cliente %s solicitou um vínculo com você no portal.", client.Name),
	}
	return s.notificationRepo.Create(ctx, notification)
}

// AcceptLink aceita a solicitação de vínculo e notifica o cliente e o advogado.
func (s *LinkService) AcceptLink(ctx context.Context, linkID uuid.UUID) error {
	// 1. Buscar o vínculo
	link, err := s.linkRepo.FindByID(ctx, linkID)
	if err != nil {
		return err
	}
	if link == nil {
		return fmt.Errorf("vínculo %s não encontrado", linkID)
	}

	link.Status = "aceito"
	err = s.linkRepo.Update(ctx, link)
	if err != nil {
		return err
	}

	// 2. Buscar o contador e o cliente para os nomes das notificações
	accountant, err := s.userRepo.GetByID(ctx, link.AccountantID)
	if err != nil {
		return err
	}
	client, err := s.userRepo.GetByID(ctx, link.ClientID)
	if err != nil {
		return err
	}

	accountantName := "Contador"
	if accountant != nil {
		accountantName = accountant.Name
	}
	clientName := "Cliente"
	if client != nil {
		clientName = client.Name
	}

	// 3. Notificar o cliente
	clientNotification := &repository.Notification{
		UserID:  link.ClientID,
		Title:   "Vínculo Aceito",
		Message: fmt.Sprintf("Sua solicitação de vínculo com o contador %s foi aceita.", accountantName),
	}
	_ = s.notificationRepo.Create(ctx, clientNotification)

	// 4. Buscar e notificar o advogado do cliente
	members, err := s.userRepo.ListMembers(ctx, link.ClientID)
	if err == nil {
		for _, member := range members {
			if member.Role == "advogado" || member.ID != link.ClientID {
				advNotification := &repository.Notification{
					UserID:  member.ID,
					Title:   "Vínculo Aceito por Contador",
					Message: fmt.Sprintf("O contador %s aceitou o vínculo com seu cliente %s.", accountantName, clientName),
				}
				_ = s.notificationRepo.Create(ctx, advNotification)
			}
		}
	}

	return nil
}

// RejectLink recusa a solicitação de vínculo e notifica o cliente.
func (s *LinkService) RejectLink(ctx context.Context, linkID uuid.UUID) error {
	// 1. Buscar o vínculo
	link, err := s.linkRepo.FindByID(ctx, linkID)
	if err != nil {
		return err
	}
	if link == nil {
		return fmt.Errorf("vínculo %s não encontrado", linkID)
	}

	link.Status = "recusado"
	err = s.linkRepo.Update(ctx, link)
	if err != nil {
		return err
	}

	// 2. Buscar o contador
	accountant, err := s.userRepo.GetByID(ctx, link.AccountantID)
	if err != nil {
		return err
	}
	accountantName := "Contador"
	if accountant != nil {
		accountantName = accountant.Name
	}

	// 3. Notificar o cliente
	clientNotification := &repository.Notification{
		UserID:  link.ClientID,
		Title:   "Vínculo Recusado",
		Message: fmt.Sprintf("Sua solicitação de vínculo com o contador %s foi recusada.", accountantName),
	}
	return s.notificationRepo.Create(ctx, clientNotification)
}

// TransitionStatus altera o status de um vínculo seguindo regras estritas e gera logs e notificações.
func (s *LinkService) TransitionStatus(ctx context.Context, linkID uuid.UUID, newStatus string, actorID uuid.UUID, actorRole string) error {
	// 1. Buscar o vínculo atual
	link, err := s.linkRepo.FindByID(ctx, linkID)
	if err != nil {
		return err
	}
	if link == nil {
		return fmt.Errorf("vínculo %s não encontrado", linkID)
	}

	currentStatus := link.Status

	// 2. Validar a transição conforme regras (D-05 a D-12)
	if !isValidTransition(currentStatus, newStatus, actorRole) {
		return fmt.Errorf("transição inválida de %s para %s por %s", currentStatus, newStatus, actorRole)
	}

	// 3. Atualizar status no banco via repository/link.go
	err = s.linkRepo.UpdateStatus(ctx, linkID, newStatus)
	if err != nil {
		return err
	}

	// 4. Buscar process_id para o evento
	processID, err := s.linkRepo.GetProcessIDByClientID(ctx, link.ClientID)
	if err == nil && processID != uuid.Nil {
		// 5. Insere evento em process_events (D-20)
		metadataMap := map[string]interface{}{
			"from_status": currentStatus,
			"to_status":   newStatus,
		}
		metadataJSON, _ := json.Marshal(metadataMap)

		event := &repository.ProcessEvent{
			ProcessID: processID,
			EventType: "mudanca_estado_vinculo",
			ActorID:   actorID,
			ActorRole: actorRole,
			Metadata:  json.RawMessage(metadataJSON),
		}
		_ = s.processEventsRepo.Create(ctx, event)
	}

	// 6. Buscar o contador e o cliente para os nomes das notificações
	accountant, _ := s.userRepo.GetByID(ctx, link.AccountantID)
	client, _ := s.userRepo.GetByID(ctx, link.ClientID)

	accountantName := "Contador"
	if accountant != nil {
		accountantName = accountant.Name
	}
	clientName := "Cliente"
	if client != nil {
		clientName = client.Name
	}

	// 7. Disparar notificações apropriadas (D-20)
	var notifTitle, notifMsg string
	var targetUserID uuid.UUID

	switch newStatus {
	case "ativo":
		targetUserID = link.ClientID
		notifTitle = "Serviço Iniciado"
		notifMsg = fmt.Sprintf("O contador %s iniciou a prestação do serviço para você.", accountantName)
	case "em_andamento":
		targetUserID = link.ClientID
		notifTitle = "Serviço em Andamento"
		notifMsg = fmt.Sprintf("O status do serviço com o contador %s foi atualizado para Em Andamento.", accountantName)
	case "entregue":
		targetUserID = link.ClientID
		notifTitle = "Serviço Entregue"
		notifMsg = fmt.Sprintf("O contador %s submeteu uma entrega para o seu serviço.", accountantName)
	case "concluido":
		targetUserID = link.AccountantID
		notifTitle = "Serviço Concluído"
		notifMsg = fmt.Sprintf("O advogado de %s aprovou a entrega e concluiu o serviço.", clientName)
	case "revisao_solicitada":
		targetUserID = link.AccountantID
		notifTitle = "Revisão Solicitada"
		notifMsg = fmt.Sprintf("O advogado de %s solicitou uma revisão do entregável submetido.", clientName)
	case "cancelamento_solicitado":
		targetUserID = link.AccountantID
		notifTitle = "Cancelamento Solicitado"
		notifMsg = fmt.Sprintf("O advogado de %s solicitou o cancelamento do vínculo. Você tem 48h para resolver pendências.", clientName)
	case "cancelado":
		// Notificar ambos
		targetUserID = link.ClientID
		notifTitle = "Serviço Cancelado"
		notifMsg = fmt.Sprintf("O vínculo de serviço com o contador %s foi cancelado.", accountantName)
		_ = s.notificationRepo.Create(ctx, &repository.Notification{
			UserID:  targetUserID,
			Title:   notifTitle,
			Message: notifMsg,
		})

		targetUserID = link.AccountantID
		notifTitle = "Serviço Cancelado"
		notifMsg = fmt.Sprintf("O vínculo de serviço com o cliente %s foi cancelado.", clientName)

		// Revogar todas as permissões de documento do vínculo (D-11: Phase 11 LGPD)
		if s.lgpdRepo != nil {
			_ = s.lgpdRepo.RevokeAllByLink(ctx, linkID)
		}
	}

	if targetUserID != uuid.Nil {
		_ = s.notificationRepo.Create(ctx, &repository.Notification{
			UserID:  targetUserID,
			Title:   notifTitle,
			Message: notifMsg,
		})
	}

	// Se notificação foi para o cliente, notifica também o advogado do cliente
	if targetUserID == link.ClientID {
		members, err := s.userRepo.ListMembers(ctx, link.ClientID)
		if err == nil {
			for _, member := range members {
				if member.Role == "advogado" || member.ID != link.ClientID {
					_ = s.notificationRepo.Create(ctx, &repository.Notification{
						UserID:  member.ID,
						Title:   notifTitle,
						Message: fmt.Sprintf("Notificação para o cliente %s: %s", clientName, notifMsg),
					})
				}
			}
		}
	}

	return nil
}

func isValidTransition(current, next string, actorRole string) bool {
	switch next {
	case "ativo":
		return current == "aceito" && actorRole == "contador"
	case "em_andamento":
		return current == "ativo" && actorRole == "contador"
	case "entregue":
		return (current == "em_andamento" || current == "revisao_solicitada") && actorRole == "contador"
	case "concluido":
		return current == "entregue" && actorRole == "advogado"
	case "revisao_solicitada":
		return current == "entregue" && actorRole == "advogado"
	case "cancelamento_solicitado":
		return current != "concluido" && current != "cancelado" && current != "recusado" && actorRole == "advogado"
	case "cancelado":
		return current == "cancelamento_solicitado" && (actorRole == "contador" || actorRole == "sistema" || actorRole == "advogado")
	}
	return false
}

