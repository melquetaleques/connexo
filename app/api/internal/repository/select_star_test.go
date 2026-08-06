package repository

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// TestNoSelectStarOnUsers protege contra uma regressão específica: a tabela
// `users` carrega colunas de perfil (bio, city, availability, rating,
// subscription_*) que não existem em domain.User. Um `SELECT *` faz o scan do
// sqlx falhar com "missing destination name", e o erro se disfarça de
// "credenciais inválidas" no login.
func TestNoSelectStarOnUsers(t *testing.T) {
	entries, err := os.ReadDir(".")
	if err != nil {
		t.Fatalf("erro ao listar o pacote: %v", err)
	}

	for _, entry := range entries {
		name := entry.Name()
		if entry.IsDir() || !strings.HasSuffix(name, ".go") || strings.HasSuffix(name, "_test.go") {
			continue
		}

		content, err := os.ReadFile(filepath.Clean(name))
		if err != nil {
			t.Fatalf("erro ao ler %s: %v", name, err)
		}

		for i, line := range strings.Split(string(content), "\n") {
			normalized := strings.ToUpper(line)
			if strings.Contains(normalized, "SELECT * FROM USERS") {
				t.Errorf("%s:%d usa SELECT * na tabela users — liste as colunas explicitamente", name, i+1)
			}
		}
	}
}
