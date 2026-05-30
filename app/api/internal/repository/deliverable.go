package repository

import (
	"context"
	"database/sql"
	"errors"
	"io"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// Deliverable representa um entregável enviado pelo contador.
type Deliverable struct {
	ID            uuid.UUID  `db:"id" json:"id"`
	LinkID        uuid.UUID  `db:"link_id" json:"link_id"`
	SubmittedBy   uuid.UUID  `db:"submitted_by" json:"submitted_by"`
	ContentText   string     `db:"content_text" json:"content_text"`
	FileName      string     `db:"file_name" json:"file_name"`
	FileSize      int64      `db:"file_size" json:"file_size"`
	Status        string     `db:"status" json:"status"`
	ReviewComment string     `db:"review_comment" json:"review_comment"`
	SubmittedAt   time.Time  `db:"submitted_at" json:"submitted_at"`
	ReviewedAt    *time.Time `db:"reviewed_at" json:"reviewed_at"`
	CreatedAt     time.Time  `db:"created_at" json:"created_at"`
}

// DeliverableRepository gerencia entregáveis no banco e no MinIO.
type DeliverableRepository struct {
	db          *sqlx.DB
	minioClient *minio.Client
	bucketName  string
}

// NewDeliverableRepository cria uma nova instância de DeliverableRepository.
func NewDeliverableRepository(db *sqlx.DB) (*DeliverableRepository, error) {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")

	if endpoint == "" {
		endpoint = "localhost:9000"
	}
	if accessKey == "" {
		accessKey = "minioadmin"
	}
	if secretKey == "" {
		secretKey = "minioadmin"
	}

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false,
	})
	if err != nil {
		return nil, err
	}

	bucketName := "connexo-deliverables"

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	exists, err := minioClient.BucketExists(ctx, bucketName)
	if err == nil && !exists {
		_ = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	}

	return &DeliverableRepository{
		db:          db,
		minioClient: minioClient,
		bucketName:  bucketName,
	}, nil
}

// Create insere um novo entregável no banco de dados.
func (r *DeliverableRepository) Create(ctx context.Context, d *Deliverable) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	if d.CreatedAt.IsZero() {
		d.CreatedAt = time.Now()
	}
	if d.SubmittedAt.IsZero() {
		d.SubmittedAt = time.Now()
	}
	if d.Status == "" {
		d.Status = "entregue"
	}

	query := `
		INSERT INTO deliverables (id, link_id, submitted_by, content_text, file_name, file_size, status, review_comment, submitted_at, reviewed_at, created_at)
		VALUES (:id, :link_id, :submitted_by, :content_text, :file_name, :file_size, :status, :review_comment, :submitted_at, :reviewed_at, :created_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, d)
	return err
}

// GetByID busca um entregável por ID.
func (r *DeliverableRepository) GetByID(ctx context.Context, id uuid.UUID) (*Deliverable, error) {
	var d Deliverable
	query := `SELECT id, link_id, submitted_by, content_text, file_name, file_size, status, review_comment, submitted_at, reviewed_at, created_at FROM deliverables WHERE id = $1`
	err := r.db.GetContext(ctx, &d, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &d, nil
}

// ListByLink lista todos os entregáveis associados a um vínculo.
func (r *DeliverableRepository) ListByLink(ctx context.Context, linkID uuid.UUID) ([]Deliverable, error) {
	var deliverables []Deliverable
	query := `
		SELECT id, link_id, submitted_by, content_text, file_name, file_size, status, review_comment, submitted_at, reviewed_at, created_at
		FROM deliverables
		WHERE link_id = $1
		ORDER BY submitted_at DESC
	`
	err := r.db.SelectContext(ctx, &deliverables, query, linkID)
	if err != nil {
		return nil, err
	}
	return deliverables, nil
}

// UpdateReview atualiza o status e comentário de revisão de um entregável.
func (r *DeliverableRepository) UpdateReview(ctx context.Context, id uuid.UUID, status string, comment string) error {
	now := time.Now()
	query := `
		UPDATE deliverables
		SET status = $1, review_comment = $2, reviewed_at = $3
		WHERE id = $4
	`
	_, err := r.db.ExecContext(ctx, query, status, comment, now, id)
	return err
}

// Upload faz upload do arquivo para o MinIO e retorna o nome da chave.
func (r *DeliverableRepository) Upload(ctx context.Context, reader io.Reader, size int64, filename string, contentType string) (string, error) {
	key := uuid.New().String() + "_" + filename

	_, err := r.minioClient.PutObject(ctx, r.bucketName, key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}

	return key, nil
}
