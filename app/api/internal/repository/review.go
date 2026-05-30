package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// Review representa uma avaliação de cliente sobre um contador.
type Review struct {
	ID           uuid.UUID  `db:"id" json:"id"`
	AccountantID uuid.UUID  `db:"accountant_id" json:"accountant_id"`
	ClientID     uuid.UUID  `db:"client_id" json:"client_id"`
	LinkID       uuid.UUID  `db:"link_id" json:"link_id"`
	Rating       int        `db:"rating" json:"rating"`
	Comment      string     `db:"comment" json:"comment"`
	ReplyText    string     `db:"reply_text" json:"reply_text"`
	SubmittedAt  time.Time  `db:"submitted_at" json:"submitted_at"`
	RepliedAt    *time.Time `db:"replied_at" json:"replied_at"`
}

// ReviewRepository gerencia a persistência de avaliações.
type ReviewRepository struct {
	db *sqlx.DB
}

// NewReviewRepository cria uma nova instância de ReviewRepository.
func NewReviewRepository(db *sqlx.DB) *ReviewRepository {
	return &ReviewRepository{db: db}
}

// Create insere uma nova avaliação e recalcula o rating médio do contador.
func (r *ReviewRepository) Create(ctx context.Context, review *Review) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if review.ID == uuid.Nil {
		review.ID = uuid.New()
	}
	review.SubmittedAt = time.Now()

	query := `
		INSERT INTO accountant_reviews (id, accountant_id, client_id, link_id, rating, comment, submitted_at)
		VALUES (:id, :accountant_id, :client_id, :link_id, :rating, :comment, :submitted_at)
	`
	_, err = tx.NamedExecContext(ctx, query, review)
	if err != nil {
		return err
	}

	// Recalcular rating médio do contador
	updateQuery := `
		UPDATE users SET rating = (
			SELECT COALESCE(AVG(rating::numeric), 0) FROM accountant_reviews WHERE accountant_id = $1
		) WHERE id = $1
	`
	_, err = tx.ExecContext(ctx, updateQuery, review.AccountantID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

// FindByLink busca uma avaliação pelo link_id.
func (r *ReviewRepository) FindByLink(ctx context.Context, linkID uuid.UUID) (*Review, error) {
	var review Review
	query := `
		SELECT id, accountant_id, client_id, link_id, rating, comment, reply_text, submitted_at, replied_at
		FROM accountant_reviews
		WHERE link_id = $1
	`
	err := r.db.GetContext(ctx, &review, query, linkID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &review, nil
}

// ListByAccountant busca avaliações de um contador com paginação.
func (r *ReviewRepository) ListByAccountant(ctx context.Context, accountantID uuid.UUID, limit, offset int) ([]*Review, error) {
	var reviews []*Review
	query := `
		SELECT id, accountant_id, client_id, link_id, rating, comment, reply_text, submitted_at, replied_at
		FROM accountant_reviews
		WHERE accountant_id = $1
		ORDER BY submitted_at DESC
		LIMIT $2 OFFSET $3
	`
	err := r.db.SelectContext(ctx, &reviews, query, accountantID, limit, offset)
	if err != nil {
		return nil, err
	}
	return reviews, nil
}

// CountByAccountant retorna o total de avaliações de um contador.
func (r *ReviewRepository) CountByAccountant(ctx context.Context, accountantID uuid.UUID) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM accountant_reviews WHERE accountant_id = $1`
	err := r.db.GetContext(ctx, &count, query, accountantID)
	if err != nil {
		return 0, err
	}
	return count, nil
}

// UpdateReply atualiza a resposta do contador à avaliação.
func (r *ReviewRepository) UpdateReply(ctx context.Context, id uuid.UUID, replyText string) error {
	now := time.Now()
	query := `UPDATE accountant_reviews SET reply_text = $1, replied_at = $2 WHERE id = $3`
	_, err := r.db.ExecContext(ctx, query, replyText, now, id)
	return err
}

// FindByID busca uma avaliação por ID.
func (r *ReviewRepository) FindByID(ctx context.Context, id uuid.UUID) (*Review, error) {
	var review Review
	query := `
		SELECT id, accountant_id, client_id, link_id, rating, comment, reply_text, submitted_at, replied_at
		FROM accountant_reviews
		WHERE id = $1
	`
	err := r.db.GetContext(ctx, &review, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &review, nil
}
