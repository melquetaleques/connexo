package repository

import (
	"context"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// MediaBucket é o bucket do MinIO para mídia de perfil (logos e fotos).
const MediaBucket = "connexo-media"

// MediaRepository gerencia upload de mídia para o perfil do contador no MinIO.
type MediaRepository struct {
	minioClient *minio.Client
}

// NewMediaRepository cria uma nova instância de MediaRepository.
func NewMediaRepository() (*MediaRepository, error) {
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

	// Garante que o bucket connexo-media exista
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	exists, err := minioClient.BucketExists(ctx, MediaBucket)
	if err == nil && !exists {
		_ = minioClient.MakeBucket(ctx, MediaBucket, minio.MakeBucketOptions{})
	}

	return &MediaRepository{minioClient: minioClient}, nil
}

// UploadLogo faz upload do arquivo de logo para o MinIO e retorna o path interno.
func (r *MediaRepository) UploadLogo(ctx context.Context, reader io.Reader, size int64, contentType string, accountantID uuid.UUID) (string, error) {
	if contentType != "image/jpeg" && contentType != "image/png" {
		return "", fmt.Errorf("formato de arquivo não suportado: %s (apenas JPEG e PNG)", contentType)
	}

	if size > 5*1024*1024 {
		return "", fmt.Errorf("logo excede o limite de 5MB")
	}

	key := fmt.Sprintf("logos/%s/logo.jpg", accountantID.String())

	_, err := r.minioClient.PutObject(ctx, MediaBucket, key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}

	return key, nil
}

// UploadPhoto faz upload de uma foto para o MinIO e retorna o path interno.
func (r *MediaRepository) UploadPhoto(ctx context.Context, reader io.Reader, size int64, contentType string, accountantID uuid.UUID, photoIndex int) (string, error) {
	if contentType != "image/jpeg" && contentType != "image/png" {
		return "", fmt.Errorf("formato de arquivo não suportado: %s (apenas JPEG e PNG)", contentType)
	}

	if size > 10*1024*1024 {
		return "", fmt.Errorf("foto excede o limite de 10MB")
	}

	ext := "jpg"
	if contentType == "image/png" {
		ext = "png"
	}

	key := fmt.Sprintf("photos/%s/photo_%d.%s", accountantID.String(), photoIndex, ext)

	_, err := r.minioClient.PutObject(ctx, MediaBucket, key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}

	return key, nil
}
