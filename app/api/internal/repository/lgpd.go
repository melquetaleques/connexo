package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// LGPDRepository gerencia consentimentos LGPD, permissões de documentos e solicitações de documentos.
type LGPDRepository struct {
	db *sqlx.DB
}

// NewLGPDRepository cria uma nova instância de LGPDRepository.
func NewLGPDRepository(db *sqlx.DB) *LGPDRepository {
	return &LGPDRepository{db: db}
}

// ---------------------------------------------------------------------------
// ClientConsents
// ---------------------------------------------------------------------------

// CreateConsent registra o consentimento LGPD de um cliente.
func (r *LGPDRepository) CreateConsent(ctx context.Context, consent *ConsentRecord) error {
	if consent.ID == uuid.Nil {
		consent.ID = uuid.New()
	}
	if consent.ConsentedAt.IsZero() {
		consent.ConsentedAt = time.Now()
	}
	if consent.TextVersion == "" {
		consent.TextVersion = "lgpd-v1.0"
	}

	query := `
		INSERT INTO client_consents (id, client_id, link_id, consented_at, ip_address, user_agent, text_version)
		VALUES (:id, :client_id, :link_id, :consented_at, :ip_address, :user_agent, :text_version)
	`
	_, err := r.db.NamedExecContext(ctx, query, consent)
	return err
}

// GetConsentByLink busca o consentimento de um vínculo específico.
func (r *LGPDRepository) GetConsentByLink(ctx context.Context, linkID uuid.UUID) (*ConsentRecord, error) {
	var c ConsentRecord
	query := `
		SELECT id, client_id, link_id, consented_at, ip_address, user_agent, text_version
		FROM client_consents
		WHERE link_id = $1
		LIMIT 1
	`
	err := r.db.GetContext(ctx, &c, query, linkID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &c, nil
}

// HasConsent verifica se existe consentimento para um cliente e link.
func (r *LGPDRepository) HasConsent(ctx context.Context, clientID, linkID uuid.UUID) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM client_consents WHERE client_id = $1 AND link_id = $2)`
	err := r.db.QueryRowContext(ctx, query, clientID, linkID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

// ---------------------------------------------------------------------------
// DocPermissions
// ---------------------------------------------------------------------------

// CreatePermission concede permissão de acesso a um documento para um vínculo.
func (r *LGPDRepository) CreatePermission(ctx context.Context, perm *DocPerm) error {
	if perm.ID == uuid.Nil {
		perm.ID = uuid.New()
	}
	if perm.GrantedAt.IsZero() {
		perm.GrantedAt = time.Now()
	}

	query := `
		INSERT INTO doc_permissions (id, document_id, link_id, granted_by, granted_at, revoked_at)
		VALUES (:id, :document_id, :link_id, :granted_by, :granted_at, :revoked_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, perm)
	return err
}

// RevokePermission revoga a permissão de um documento para um vínculo.
func (r *LGPDRepository) RevokePermission(ctx context.Context, documentID, linkID uuid.UUID) error {
	now := time.Now()
	query := `
		UPDATE doc_permissions
		SET revoked_at = $1
		WHERE document_id = $2 AND link_id = $3 AND revoked_at IS NULL
	`
	_, err := r.db.ExecContext(ctx, query, now, documentID, linkID)
	return err
}

// TogglePermission concede ou revoga permissão de documento. Retorna o novo estado (true = concedida).
func (r *LGPDRepository) TogglePermission(ctx context.Context, documentID, linkID, grantedBy uuid.UUID) (bool, error) {
	// Verificar permissão existente
	var existing DocPerm
	query := `SELECT id, document_id, link_id, granted_by, granted_at, revoked_at FROM doc_permissions WHERE document_id = $1 AND link_id = $2 AND revoked_at IS NULL LIMIT 1`
	err := r.db.GetContext(ctx, &existing, query, documentID, linkID)
	if err == nil {
		// Existe permissão ativa — revogar
		err = r.RevokePermission(ctx, documentID, linkID)
		if err != nil {
			return false, err
		}
		return false, nil
	}

	if !errors.Is(err, sql.ErrNoRows) {
		return false, err
	}

	// Não existe — conceder
	perm := &DocPerm{
		DocumentID: documentID,
		LinkID:     linkID,
		GrantedBy:  grantedBy,
	}
	err = r.CreatePermission(ctx, perm)
	if err != nil {
		return false, err
	}
	return true, nil
}

// HasPermission verifica se um documento tem permissão ativa para um vínculo.
func (r *LGPDRepository) HasPermission(ctx context.Context, documentID, linkID uuid.UUID) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM doc_permissions WHERE document_id = $1 AND link_id = $2 AND revoked_at IS NULL)`
	err := r.db.QueryRowContext(ctx, query, documentID, linkID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

// ListPermissionsByLink lista todas as permissões ativas de documentos para um vínculo.
func (r *LGPDRepository) ListPermissionsByLink(ctx context.Context, linkID uuid.UUID) ([]*DocPerm, error) {
	var perms []*DocPerm
	query := `
		SELECT id, document_id, link_id, granted_by, granted_at, revoked_at
		FROM doc_permissions
		WHERE link_id = $1 AND revoked_at IS NULL
		ORDER BY granted_at DESC
	`
	err := r.db.SelectContext(ctx, &perms, query, linkID)
	if err != nil {
		return nil, err
	}
	if perms == nil {
		perms = []*DocPerm{}
	}
	return perms, nil
}

// ListPermissionsByDocument lista se um documento tem permissão ativa para cada link.
func (r *LGPDRepository) ListPermissionsByDocument(ctx context.Context, documentID uuid.UUID) ([]*DocPerm, error) {
	var perms []*DocPerm
	query := `
		SELECT id, document_id, link_id, granted_by, granted_at, revoked_at
		FROM doc_permissions
		WHERE document_id = $1 AND revoked_at IS NULL
		ORDER BY granted_at DESC
	`
	err := r.db.SelectContext(ctx, &perms, query, documentID)
	if err != nil {
		return nil, err
	}
	if perms == nil {
		perms = []*DocPerm{}
	}
	return perms, nil
}

// RevokeAllByLink revoga TODAS as permissões de documento de um vínculo (usado no cancelamento).
func (r *LGPDRepository) RevokeAllByLink(ctx context.Context, linkID uuid.UUID) error {
	now := time.Now()
	query := `UPDATE doc_permissions SET revoked_at = $1 WHERE link_id = $2 AND revoked_at IS NULL`
	_, err := r.db.ExecContext(ctx, query, now, linkID)
	return err
}

// ---------------------------------------------------------------------------
// DocumentRequests
// ---------------------------------------------------------------------------

// CreateDocumentRequest cria uma nova solicitação de documento.
func (r *LGPDRepository) CreateDocumentRequest(ctx context.Context, req *DocReq) error {
	if req.ID == uuid.Nil {
		req.ID = uuid.New()
	}
	if req.CreatedAt.IsZero() {
		req.CreatedAt = time.Now()
	}
	if req.UpdatedAt.IsZero() {
		req.UpdatedAt = time.Now()
	}
	if req.Status == "" {
		req.Status = "pendente"
	}

	query := `
		INSERT INTO document_requests (id, process_id, requested_by, client_id, description, status, created_at, updated_at)
		VALUES (:id, :process_id, :requested_by, :client_id, :description, :status, :created_at, :updated_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, req)
	return err
}

// UpdateDocumentRequestStatus atualiza o status de uma solicitação de documento.
func (r *LGPDRepository) UpdateDocumentRequestStatus(ctx context.Context, id uuid.UUID, status string) error {
	now := time.Now()
	query := `UPDATE document_requests SET status = $1, updated_at = $2 WHERE id = $3`
	_, err := r.db.ExecContext(ctx, query, status, now, id)
	return err
}

// ListDocumentRequestsByClient lista solicitações de documento de um cliente.
func (r *LGPDRepository) ListDocumentRequestsByClient(ctx context.Context, clientID uuid.UUID, limit, offset int) ([]*DocReq, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	var reqs []*DocReq
	query := `
		SELECT id, process_id, requested_by, client_id, description, status, created_at, updated_at
		FROM document_requests
		WHERE client_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`
	err := r.db.SelectContext(ctx, &reqs, query, clientID, limit, offset)
	if err != nil {
		return nil, err
	}
	if reqs == nil {
		reqs = []*DocReq{}
	}
	return reqs, nil
}

// ListDocumentRequestsByProcess lista solicitações de documento de um processo (advogado view).
func (r *LGPDRepository) ListDocumentRequestsByProcess(ctx context.Context, processID uuid.UUID) ([]*DocReq, error) {
	var reqs []*DocReq
	query := `
		SELECT id, process_id, requested_by, client_id, description, status, created_at, updated_at
		FROM document_requests
		WHERE process_id = $1
		ORDER BY created_at DESC
	`
	err := r.db.SelectContext(ctx, &reqs, query, processID)
	if err != nil {
		return nil, err
	}
	if reqs == nil {
		reqs = []*DocReq{}
	}
	return reqs, nil
}

// GetDocumentRequestByID busca uma solicitação de documento por ID.
func (r *LGPDRepository) GetDocumentRequestByID(ctx context.Context, id uuid.UUID) (*DocReq, error) {
	var req DocReq
	query := `
		SELECT id, process_id, requested_by, client_id, description, status, created_at, updated_at
		FROM document_requests
		WHERE id = $1
	`
	err := r.db.GetContext(ctx, &req, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &req, nil
}

// ---------------------------------------------------------------------------
// AuditLog (access log for document access)
// ---------------------------------------------------------------------------

// LogDocumentAccess registra no audit_logs o acesso a um documento.
func (r *LGPDRepository) LogDocumentAccess(ctx context.Context, userID, documentID uuid.UUID, ipAddress, processIDStr string) error {
	query := `
		INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, metadata, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	id := uuid.New()
	metadata := "{\"ip\":\"" + ipAddress + "\",\"process_id\":\"" + processIDStr + "\"}"
	resourceID := documentID.String()
	if documentID == uuid.Nil {
		resourceID = ""
	}
	_, err := r.db.ExecContext(ctx, query, id, userID, "document_access", "document", resourceID, metadata, time.Now())
	return err
}

// LogDocumentAccessWithKey registra no audit_logs o acesso a um documento usando a key do MinIO.
func (r *LGPDRepository) LogDocumentAccessWithKey(ctx context.Context, userID uuid.UUID, key, ipAddress, bucket string) error {
	query := `
		INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, metadata, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	id := uuid.New()
	metadata := "{\"ip\":\"" + ipAddress + "\",\"key\":\"" + key + "\",\"bucket\":\"" + bucket + "\"}"
	_, err := r.db.ExecContext(ctx, query, id, userID, "document_access", "document", key, metadata, time.Now())
	return err
}
