// Package db expõe as migrations SQL do Connexo e o runner que as aplica.
//
// As migrations ficam em db/migrations/*.sql e são aplicadas em ordem
// lexicográfica. Cada arquivo roda dentro de uma transação e é registrado na
// tabela schema_migrations, de modo que reaplicações são no-op.
package db

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"sort"

	"github.com/jmoiron/sqlx"
)

//go:embed migrations/*.sql
var migrationFS embed.FS

const schemaMigrationsDDL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
    version     TEXT PRIMARY KEY,
    applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`

// Migration é um arquivo SQL versionado.
type Migration struct {
	Version string
	SQL     string
}

// LoadMigrations lê as migrations embutidas, ordenadas por versão.
func LoadMigrations() ([]Migration, error) {
	entries, err := fs.ReadDir(migrationFS, "migrations")
	if err != nil {
		return nil, fmt.Errorf("erro ao ler migrations embutidas: %w", err)
	}

	migrations := make([]Migration, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		content, err := migrationFS.ReadFile("migrations/" + entry.Name())
		if err != nil {
			return nil, fmt.Errorf("erro ao ler migration %s: %w", entry.Name(), err)
		}
		migrations = append(migrations, Migration{
			Version: entry.Name(),
			SQL:     string(content),
		})
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})
	return migrations, nil
}

// Migrate aplica todas as migrations pendentes.
//
// Retorna a lista de versões aplicadas nesta execução.
func Migrate(ctx context.Context, database *sqlx.DB) ([]string, error) {
	if _, err := database.ExecContext(ctx, schemaMigrationsDDL); err != nil {
		return nil, fmt.Errorf("erro ao criar schema_migrations: %w", err)
	}

	applied := map[string]bool{}
	var versions []string
	if err := database.SelectContext(ctx, &versions, `SELECT version FROM schema_migrations`); err != nil {
		return nil, fmt.Errorf("erro ao listar migrations aplicadas: %w", err)
	}
	for _, v := range versions {
		applied[v] = true
	}

	migrations, err := LoadMigrations()
	if err != nil {
		return nil, err
	}

	var ran []string
	for _, m := range migrations {
		if applied[m.Version] {
			continue
		}

		tx, err := database.BeginTxx(ctx, nil)
		if err != nil {
			return ran, fmt.Errorf("erro ao iniciar transação para %s: %w", m.Version, err)
		}

		if _, err := tx.ExecContext(ctx, m.SQL); err != nil {
			_ = tx.Rollback()
			return ran, fmt.Errorf("erro ao aplicar migration %s: %w", m.Version, err)
		}

		if _, err := tx.ExecContext(ctx, `INSERT INTO schema_migrations (version) VALUES ($1)`, m.Version); err != nil {
			_ = tx.Rollback()
			return ran, fmt.Errorf("erro ao registrar migration %s: %w", m.Version, err)
		}

		if err := tx.Commit(); err != nil {
			return ran, fmt.Errorf("erro ao commitar migration %s: %w", m.Version, err)
		}

		ran = append(ran, m.Version)
	}

	return ran, nil
}
