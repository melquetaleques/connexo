package repository

import "os"

// minioConfig resolves MinIO connection settings from environment.
// Preferred names: MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY.
// Aliases (documented in .env.example): CONNEXO_STORAGE_*.
func minioConfig() (endpoint, accessKey, secretKey string) {
	endpoint = firstEnv("MINIO_ENDPOINT", "CONNEXO_STORAGE_ENDPOINT")
	accessKey = firstEnv("MINIO_ACCESS_KEY", "CONNEXO_STORAGE_ACCESS_KEY")
	secretKey = firstEnv("MINIO_SECRET_KEY", "CONNEXO_STORAGE_SECRET_KEY")
	if endpoint == "" {
		endpoint = "localhost:9000"
	}
	if accessKey == "" {
		accessKey = "minioadmin"
	}
	if secretKey == "" {
		secretKey = "minioadmin"
	}
	return endpoint, accessKey, secretKey
}

func firstEnv(keys ...string) string {
	for _, k := range keys {
		if v := os.Getenv(k); v != "" {
			return v
		}
	}
	return ""
}
