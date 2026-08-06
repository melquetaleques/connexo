package db

import (
	"sort"
	"strings"
	"testing"
)

func TestLoadMigrationsIsOrderedAndNonEmpty(t *testing.T) {
	migrations, err := LoadMigrations()
	if err != nil {
		t.Fatalf("LoadMigrations() erro: %v", err)
	}
	if len(migrations) == 0 {
		t.Fatal("nenhuma migration embutida — o //go:embed não está capturando db/migrations/*.sql")
	}

	versions := make([]string, len(migrations))
	for i, m := range migrations {
		if strings.TrimSpace(m.SQL) == "" {
			t.Errorf("migration %s está vazia", m.Version)
		}
		if !strings.HasSuffix(m.Version, ".sql") {
			t.Errorf("migration %s não é um arquivo .sql", m.Version)
		}
		versions[i] = m.Version
	}

	if !sort.StringsAreSorted(versions) {
		t.Errorf("migrations fora de ordem: %v", versions)
	}
}

func TestMigrationVersionsAreUnique(t *testing.T) {
	migrations, err := LoadMigrations()
	if err != nil {
		t.Fatalf("LoadMigrations() erro: %v", err)
	}

	seen := map[string]bool{}
	for _, m := range migrations {
		// O prefixo numérico define a ordem de aplicação e não pode repetir,
		// caso contrário a ordem entre duas migrations vira detalhe do
		// nome do arquivo.
		prefix, _, found := strings.Cut(m.Version, "_")
		if !found {
			t.Errorf("migration %s não segue o padrão NNN_nome.sql", m.Version)
			continue
		}
		if seen[prefix] {
			t.Errorf("prefixo de versão duplicado: %s", prefix)
		}
		seen[prefix] = true
	}
}
