package repository

import (
	"os"
	"strings"
	"testing"
)

func extractStructBlock(src, typeName string) string {
	marker := "type " + typeName + " struct"
	start := strings.Index(src, marker)
	if start < 0 {
		return ""
	}
	rest := src[start:]
	end := strings.Index(rest, "\n}")
	if end < 0 {
		return rest
	}
	return rest[:end+2]
}

// TestPublicPayloadsHaveNoEmail falha se os payloads públicos voltarem a
// serializar e-mail. Lê o fonte de user.go — mesmo estilo de select_star_test.go.
func TestPublicPayloadsHaveNoEmail(t *testing.T) {
	content, err := os.ReadFile("user.go")
	if err != nil {
		t.Fatalf("erro ao ler user.go: %v", err)
	}
	src := string(content)

	for _, typeName := range []string{"PublicAccountantListItem", "PublicAccountantProfile"} {
		block := extractStructBlock(src, typeName)
		if block == "" {
			t.Errorf("struct %s não encontrada em user.go", typeName)
			continue
		}
		if strings.Contains(block, `json:"email"`) {
			t.Errorf("%s contém json:\"email\" — payload público não pode vazar e-mail", typeName)
		}
	}
}
