package service

import (
	"context"
	"fmt"

	"app/api/internal/repository"
	"github.com/google/uuid"
)

// LinkService encapsula a lógica de negócio de vínculos entre clientes e contadores.
type LinkService struct {
	linkRepo         *repository.LinkRepository
	notificationRepo *repository.NotificationRepository
	userRepo         *repository.UserRepository
}

// NewLinkService cria uma nova instância de LinkService.
func NewLinkService(
	linkRepo *repository.LinkRepository,
	notificationRepo *repository.NotificationRepository,
	userRepo *repository.UserRepository,
) *LinkService {
	return &LinkService{
		linkRepo:         linkRepo,
		notificationRepo: notificationRepo,
		userRepo:         userRepo,
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
