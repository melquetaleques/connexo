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

// Document representa o documento enviado pelo cliente ou advogado.
type Document struct {
	ID        uuid.UUID `db:"id" json:"id"`
	UserID    uuid.UUID `db:"user_id" json:"user_id"`
	Name      string    `db:"name" json:"name"`
	Bucket    string    `db:"bucket" json:"bucket"`
	Key       string    `db:"key" json:"key"`
	URL       string    `db:"url" json:"url"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

// DocumentRepository gerencia documentos no banco e no MinIO.
type DocumentRepository struct {
	db          *sqlx.DB
	minioClient *minio.Client
	bucketName  string
}

// NewDocumentRepository cria uma nova instância de DocumentRepository.
func NewDocumentRepository(db *sqlx.DB) (*DocumentRepository, error) {
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

// Save insere o registro do documento no banco de dados.
func (r *DocumentRepository) Save(ctx context.Context, doc *Document) error {
	if doc.ID == uuid.Nil {
		doc.ID = uuid.New()
	}
	doc.CreatedAt = time.Now()

	query := `
		INSERT INTO documents (id, user_id, name, bucket, key, url, created_at)
		VALUES (:id, :user_id, :name, :bucket, :key, :url, :created_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, doc)
	return err
}

// Upload realiza o upload físico do documento para o MinIO.
func (r *DocumentRepository) Upload(ctx context.Context, reader io.Reader, size int64, filename string, contentType string) (*Document, error) {
	key := uuid.New().String() + "_" + filename

	// Executa o upload no MinIO
	_, err := r.minioClient.PutObject(ctx, r.bucketName, key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return nil, err
	}

	// URL interna fictícia para compatibilidade
	url := "/api/media/" + r.bucketName + "/" + key

	return &Document{
		Name:   filename,
		Bucket: r.bucketName,
		Key:    key,
		URL:    url,
	}, nil
}

// GetByID busca o registro de um documento por ID.
func (r *DocumentRepository) GetByID(ctx context.Context, id uuid.UUID) (*Document, error) {
	var doc Document
	query := `SELECT id, user_id, name, bucket, key, url, created_at FROM documents WHERE id = $1`
	err := r.db.GetContext(ctx, &doc, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &doc, nil
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
