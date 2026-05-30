package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// Post representa a entidade de postagem do contador no portal.
type Post struct {
	ID           uuid.UUID `db:"id" json:"id"`
	AccountantID uuid.UUID `db:"accountant_id" json:"accountant_id"`
	Title        string    `db:"title" json:"title"`
	Excerpt      string    `db:"excerpt" json:"excerpt"`
	Content      string    `db:"content" json:"content"`
	Tag          string    `db:"tag" json:"tag"`
	CoverURL     string    `db:"cover_url" json:"cover_url"`
	Status       string    `db:"status" json:"status"` // ex: 'publicado'
	PublishedAt  time.Time `db:"published_at" json:"published_at"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
}

// PostRepository gerencia a persistência de postagens de contadores.
type PostRepository struct {
	db *sqlx.DB
}

// NewPostRepository cria uma nova instância de PostRepository.
func NewPostRepository(db *sqlx.DB) *PostRepository {
	return &PostRepository{db: db}
}

// Create insere uma nova postagem no banco de dados.
func (r *PostRepository) Create(ctx context.Context, post *Post) error {
	if post.ID == uuid.Nil {
		post.ID = uuid.New()
	}
	if post.Status == "" {
		post.Status = "publicado"
	}
	post.CreatedAt = time.Now()
	post.PublishedAt = time.Now()

	query := `
		INSERT INTO posts (id, accountant_id, title, excerpt, content, tag, cover_url, status, published_at, created_at)
		VALUES (:id, :accountant_id, :title, :excerpt, :content, :tag, :cover_url, :status, :published_at, :created_at)
	`
	_, err := r.db.NamedExecContext(ctx, query, post)
	return err
}

// ListByAccountant lista as postagens publicadas por um contador específico com paginação.
func (r *PostRepository) ListByAccountant(ctx context.Context, accountantID uuid.UUID, limit, offset int) ([]*Post, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	var posts []*Post
	query := `
		SELECT id, accountant_id, title, excerpt, content, tag, cover_url, status, published_at, created_at
		FROM posts
		WHERE accountant_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`
	err := r.db.SelectContext(ctx, &posts, query, accountantID, limit, offset)
	if err != nil {
		return nil, err
	}

	return posts, nil
}
