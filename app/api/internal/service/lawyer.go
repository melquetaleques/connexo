package service

import (
	"context"
	"time"

	"app/api/internal/domain"
	"github.com/google/uuid"
)

// LawyerService gerencia as operações específicas do advogado.
type LawyerService struct {
	lawyers   domain.LawyerRepository
	clients   domain.ClientRepository
	processes domain.ProcessRepository
	audit     domain.AuditRepository
}

func NewLawyerService(
	lawyers domain.LawyerRepository,
	clients domain.ClientRepository,
	processes domain.ProcessRepository,
	audit domain.AuditRepository,
) *LawyerService {
	return &LawyerService{
		lawyers:   lawyers,
		clients:   clients,
		processes: processes,
		audit:     audit,
	}
}

// GetDashboardData retorna métricas para o dashboard do advogado.
func (s *LawyerService) GetDashboardData(ctx context.Context, userID uuid.UUID) (map[string]any, error) {
	lawyer, err := s.lawyers.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	clients, _ := s.clients.ListByLawyer(ctx, lawyer.ID)
	processes, _ := s.processes.ListByLawyer(ctx, lawyer.ID)

	activeProcesses := 0
	for _, p := range processes {
		if p.Status != "encerrado" && p.Status != "arquivado" {
			activeProcesses++
		}
	}

	return map[string]any{
		"total_clients":    len(clients),
		"total_processes":  len(processes),
		"active_processes": activeProcesses,
		"recent_activity":  []any{},
	}, nil
}

// CreateClient cria um novo cliente vinculado ao advogado.
func (s *LawyerService) CreateClient(ctx context.Context, userID uuid.UUID, c *domain.Client) error {
	lawyer, err := s.lawyers.FindByUserID(ctx, userID)
	if err != nil {
		return err
	}

	c.ID = uuid.New()
	c.LawyerID = lawyer.ID
	c.CreatedAt = time.Now()
	c.UpdatedAt = time.Now()
	c.Status = "ativo"

	return s.clients.Create(ctx, c)
}

// ListClients lista os clientes do advogado.
func (s *LawyerService) ListClients(ctx context.Context, userID uuid.UUID) ([]domain.Client, error) {
	lawyer, err := s.lawyers.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.clients.ListByLawyer(ctx, lawyer.ID)
}

// GetClient retorna os detalhes de um cliente específico.
func (s *LawyerService) GetClient(ctx context.Context, userID, clientID uuid.UUID) (*domain.Client, error) {
	lawyer, err := s.lawyers.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	client, err := s.clients.FindByID(ctx, clientID)
	if err != nil {
		return nil, err
	}
	if client == nil || client.LawyerID != lawyer.ID {
		return nil, ErrUnauthorized
	}

	return client, nil
}

// CreateProcess cria um novo processo para um cliente.
func (s *LawyerService) CreateProcess(ctx context.Context, userID uuid.UUID, p *domain.Process) error {
	lawyer, err := s.lawyers.FindByUserID(ctx, userID)
	if err != nil {
		return err
	}

	client, err := s.clients.FindByID(ctx, p.ClientID)
	if err != nil || client == nil || client.LawyerID != lawyer.ID {
		return ErrUnauthorized
	}

	p.ID = uuid.New()
	p.LawyerID = lawyer.ID
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()

	return s.processes.Create(ctx, p)
}

// ListProcesses lista os processos do advogado.
func (s *LawyerService) ListProcesses(ctx context.Context, userID uuid.UUID) ([]domain.Process, error) {
	lawyer, err := s.lawyers.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.processes.ListByLawyer(ctx, lawyer.ID)
}

// GetProcess retorna os detalhes de um processo específico.
func (s *LawyerService) GetProcess(ctx context.Context, userID, processID uuid.UUID) (*domain.Process, error) {
	lawyer, err := s.lawyers.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	process, err := s.processes.FindByID(ctx, processID)
	if err != nil {
		return nil, err
	}
	if process == nil || process.LawyerID != lawyer.ID {
		return nil, ErrUnauthorized
	}

	return process, nil
}
