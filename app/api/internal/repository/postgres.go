package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// DB wrap o sqlx.DB para facilitar extensões se necessário.
type DB struct {
	*sqlx.DB
}

// NewPostgres cria uma nova conexão com o PostgreSQL.
func NewPostgres(dsn string) (*DB, error) {
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar no postgres: %w", err)
	}

	// Configurações recomendadas para o pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	return &DB{db}, nil
}

// PingContext verifica se a conexão está viva.
func (db *DB) PingContext(ctx context.Context) error {
	return db.DB.PingContext(ctx)
}
