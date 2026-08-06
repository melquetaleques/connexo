package repository

import (
	"context"
	"database/sql"
	"errors"
	"io"
	"time"

	"app/api/internal/domain"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// DocumentRepository gerencia documentos no banco e no MinIO.
//
// Implementa domain.DocumentRepository e adiciona as operações de storage.
type DocumentRepository struct {
	db          *sqlx.DB
	minioClient *minio.Client
	bucketName  string
}

// NewDocumentRepository cria uma nova instância de DocumentRepository.
func NewDocumentRepository(db *sqlx.DB) (*DocumentRepository, error) {
	endpoint, accessKey, secretKey := minioConfig()

	// Inicializa o cliente do MinIO
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false, // Usar HTTP localmente
	})
	if err != nil {
		return nil, err
	}

	bucketName := "connexo-docs"

	// Garante que o bucket padrão exista
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	exists, err := minioClient.BucketExists(ctx, bucketName)
	if err == nil && !exists {
		err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			// Apenas loga ou ignora no startup se não conseguir criar imediatamente
		}
	}

	return &DocumentRepository{
		db:          db,
		minioClient: minioClient,
		bucketName:  bucketName,
	}, nil
}

const documentColumns = `id, process_id, uploaded_by, name, size_bytes, mime_type, bucket, object_key, storage_path, visible_to_accountant, created_at`

// Create insere o registro do documento no banco de dados.
func (r *DocumentRepository) Create(ctx context.Context, doc *domain.Document) error {
	if doc.ID == uuid.Nil {
		doc.ID = uuid.New()
	}
	if doc.CreatedAt.IsZero() {
		doc.CreatedAt = time.Now()
	}
	if doc.MimeType == "" {
		doc.MimeType = "application/octet-stream"
	}

	query := `
		INSERT INTO documents
			(id, process_id, uploaded_by, name, size_bytes, mime_type, bucket, object_key, storage_path, visible_to_accountant, created_at)
		VALUES
			(:id, :process_id, :uploaded_by, :name, :size_bytes, :mime_type, :bucket, :object_key, :storage_path, :visible_to_accountant, :created_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, doc)
	return err
}

// ListByProcess lista os documentos de um processo.
//
// Quando forAccountant é true, retorna apenas os documentos que o advogado
// marcou como visíveis ao contador.
func (r *DocumentRepository) ListByProcess(ctx context.Context, processID uuid.UUID, forAccountant bool) ([]domain.Document, error) {
	var docs []domain.Document
	query := `SELECT ` + documentColumns + ` FROM documents WHERE process_id = $1`
	if forAccountant {
		query += ` AND visible_to_accountant = true`
	}
	query += ` ORDER BY created_at DESC`

	if err := r.db.SelectContext(ctx, &docs, query, processID); err != nil {
		return nil, err
	}
	return docs, nil
}

// SetAccountantVisibility marca ou desmarca um documento como visível ao contador.
func (r *DocumentRepository) SetAccountantVisibility(ctx context.Context, docID uuid.UUID, visible bool) error {
	res, err := r.db.ExecContext(ctx,
		`UPDATE documents SET visible_to_accountant = $1 WHERE id = $2`, visible, docID)
	if err != nil {
		return err
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

// Upload envia o arquivo para o MinIO e devolve bucket, chave e URL interna.
func (r *DocumentRepository) Upload(ctx context.Context, reader io.Reader, size int64, filename, contentType string) (bucket, key, url string, err error) {
	key = uuid.New().String() + "_" + filename

	if _, err = r.minioClient.PutObject(ctx, r.bucketName, key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	}); err != nil {
		return "", "", "", err
	}

	return r.bucketName, key, "/api/media/" + r.bucketName + "/" + key, nil
}

// GetByID busca o registro de um documento por ID.
func (r *DocumentRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Document, error) {
	var doc domain.Document
	query := `SELECT ` + documentColumns + ` FROM documents WHERE id = $1`
	err := r.db.GetContext(ctx, &doc, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &doc, nil
}

// LogAccess registra o acesso individual a um documento (LGPD, escopo §5).
func (r *DocumentRepository) LogAccess(ctx context.Context, docID, userID uuid.UUID, ip string) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO document_access_logs (document_id, user_id, ip_address) VALUES ($1, $2, $3)`,
		docID, userID, ip)
	return err
}

// GetObjectStream busca o arquivo físico no MinIO como stream.
func (r *DocumentRepository) GetObjectStream(ctx context.Context, bucket, key string) (io.ReadCloser, string, int64, error) {
	obj, err := r.minioClient.GetObject(ctx, bucket, key, minio.GetObjectOptions{})
	if err != nil {
		return nil, "", 0, err
	}

	stat, err := obj.Stat()
	if err != nil {
		obj.Close()
		return nil, "", 0, err
	}

	return obj, stat.ContentType, stat.Size, nil
}
