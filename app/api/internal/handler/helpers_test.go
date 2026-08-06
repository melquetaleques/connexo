package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"app/api/internal/domain"
)

func TestRespondEncodesNilSliceAsEmptyArray(t *testing.T) {
	cases := []struct {
		name string
		body any
		want string
	}{
		{"slice de struct nil", []domain.Client(nil), "[]"},
		{"slice de ponteiro nil", []*domain.Process(nil), "[]"},
		{"slice preenchido", []string{"a"}, `["a"]`},
		{"slice vazio", []string{}, "[]"},
		{"objeto", map[string]string{"k": "v"}, `{"k":"v"}`},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			rec := httptest.NewRecorder()
			respond(rec, http.StatusOK, tc.body)

			got := rec.Body.String()
			var normalized any
			if err := json.Unmarshal([]byte(got), &normalized); err != nil {
				t.Fatalf("resposta não é JSON válido: %q (%v)", got, err)
			}

			var wantParsed any
			_ = json.Unmarshal([]byte(tc.want), &wantParsed)

			gotJSON, _ := json.Marshal(normalized)
			wantJSON, _ := json.Marshal(wantParsed)
			if string(gotJSON) != string(wantJSON) {
				t.Errorf("respond() = %s, esperado %s", gotJSON, wantJSON)
			}
		})
	}
}
