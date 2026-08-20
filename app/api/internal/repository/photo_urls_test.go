package repository

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestPhotoURLsScansPostgresArray(t *testing.T) {
	var profile PublicAccountantProfile

	if err := profile.PhotoURLs.Scan([]byte("{https://a,https://b}")); err != nil {
		t.Fatalf("Scan de array Postgres falhou: %v", err)
	}
	if len(profile.PhotoURLs) != 2 {
		t.Fatalf("esperava 2 elementos, obteve %d: %#v", len(profile.PhotoURLs), profile.PhotoURLs)
	}
	if profile.PhotoURLs[0] != "https://a" || profile.PhotoURLs[1] != "https://b" {
		t.Errorf("elementos inesperados: %#v", profile.PhotoURLs)
	}

	if err := profile.PhotoURLs.Scan(nil); err != nil {
		t.Fatalf("Scan(nil) falhou: %v", err)
	}

	body, err := json.Marshal(profile)
	if err != nil {
		t.Fatalf("json.Marshal falhou: %v", err)
	}
	if !strings.Contains(string(body), `"photo_urls":[]`) {
		t.Errorf("PhotoURLs nulo deve serializar como [] , obteve %s", body)
	}

	var zero PublicAccountantProfile
	zeroBody, err := json.Marshal(zero)
	if err != nil {
		t.Fatalf("json.Marshal do zero-value falhou: %v", err)
	}
	if !strings.Contains(string(zeroBody), `"photo_urls":[]`) {
		t.Errorf("PhotoURLs nulo (zero-value) deve serializar como [] , obteve %s", zeroBody)
	}
}
