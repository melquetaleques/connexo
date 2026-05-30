---
phase: 9
plan: "09-PLAN"
type: standard
wave: 1
depends_on:
  - 7
  - 8
files_modified:
  - app/api/db/migrations/10_accountant_rich_profile.sql
  - app/api/internal/handler/routes.go
  - app/api/internal/repository/user.go
  - app/api/internal/repository/document.go
  - app/web/src/types/index.ts
  - app/web/src/services/api.ts
autonomous: true
requirements:
  - PROF-01
  - PROF-02
  - PROF-03
  - PROF-04
  - ACCT-01
---

# Phase 9: Perfil Rico do Contador — Plan

**Phase:** 9
**Status:** Ready
**Mode:** standard

## 📋 Objectives
1. Migration para adicionar colunas de disponibilidade, logo e fotos ao perfil do contador.
2. Backend: endpoints de upload de logo e fotos (multipart → MinIO), endpoint de perfil público estendido com logo, fotos, disponibilidade e posts publicados.
3. Frontend: AccountantProfileEdit com upload de logo/fotos e toggle de disponibilidade.
4. Frontend: AccountantPublicProfile com seções completas (Header, Bio, Especialidades, Serviços, Posts, Avaliações placeholder).
5. Catálogo atualizado para exibir availability badge + logo nos cards.

## Tasks

<tasks>

<task type="auto">
  <name>Task 1: Migration SQL — availability, logo_url, photo_urls no accountants</name>
  <files>
    - app/api/db/migrations/10_accountant_rich_profile.sql
  </files>
  <action>
    Criar migration SQL (10_accountant_rich_profile.sql) que adiciona ao users table (role='contador'):
    1. Coluna `availability TEXT DEFAULT 'disponivel'` — valores: 'disponivel', 'parcial', 'indisponivel'
    2. Coluna `logo_url TEXT DEFAULT ''` — path no MinIO (ex: logos/{uuid}/logo.jpg)
    3. Coluna `photo_urls TEXT[] DEFAULT '{}'` — array de paths no MinIO (até 5 fotos)
    
    Usar ALTER TABLE com IF NOT EXISTS pattern (via checking information_schema ou pg_typeof).
    Para photo_urls TEXT[], Postgres suporta ALTER TABLE ADD COLUMN com tipo TEXT[].
  </action>
  <verify>
    cd app/api && go build -v ./...
  </verify>
  <done>
    Migration SQL com availability, logo_url, photo_urls adicionadas à tabela users, e compilação Go sem erros.
  </done>
</task>

<task type="auto">
  <name>Task 2: Backend — Upload de media (logo + photos) + perfil público estendido</name>
  <files>
    - app/api/internal/handler/routes.go
    - app/api/internal/repository/user.go
    - app/api/internal/repository/document.go
  </files>
  <action>
    1. Em routes.go: adicionar handlers para:
       - POST /api/acc/media/logo  → upload de logo (multipart, max 5MB, tipo image/jpeg ou image/png)
       - POST /api/acc/media/photo → upload de foto (multipart, max 10MB, tipo image/jpeg ou image/png, máx 5 fotos)
       - GET /api/public/accountants/{slug} → perfil público estendido
      
    2. Criar em user.go:
       - Método `GetPublicProfileBySlug(ctx, slug)` que retorna struct `PublicAccountantProfile` contendo:
         id, name, email, specialty, city, state, bio (ou slug como identificador), logo_url, photo_urls, availability
       - Método `UpdateAvailability(ctx, userID, availability)` 
       - Método `SaveLogoURL(ctx, userID, logoURL)`
       - Método `AddPhotoURL(ctx, userID, photoURL)` (append ao array, valida max 5)
       - Método `RemovePhotoURL(ctx, userID, index)` (remove por posição)
      
    3. Em routes.go, implementar handlers:
       - handleAccMediaLogo: parse multipart, valida tipo (image/jpeg, image/png) e tamanho (5MB), upload ao MinIO bucket "connexo-media", salva logo_url no banco
       - handleAccMediaPhoto: parse multipart, valida tipo (image/jpeg, image/png) e tamanho (10MB), verifica se já tem <5 fotos, upload ao MinIO bucket "connexo-media", append photo_urls no banco
       - handlePublicAccountantProfile: busca perfil por slug, busca posts publicados do contador, retorna JSON combinado
      
    4. Em document.go: adicionar `NewMinioClient()` ou função auxiliar para criar client MinIO para bucket "connexo-media" (reutilizar lógica existente). Ou criar `MediaRepository` separado.
       Criar `MediaRepository` em novo arquivo `media.go` no repository package com:
       - UploadLogo(ctx, reader, size, contentType, accountantID) → (string, error)
       - UploadPhoto(ctx, reader, size, contentType, accountantID) → (string, error)
    
    <important>
    - Bucket "connexo-media" para fotos e logos (separado de connexo-docs e connexo-deliverables)
    - URLs salvas no banco: path relativo (ex: "logos/{uuid}/logo.jpg") — frontend acessa via /api/media/connexo-media/{path}
    - NENHUMA URL de MinIO exposta ao frontend — sempre via proxy
    - Perfil público NÃO requer autenticação (GET /api/public/accountants/{slug})
    - Upload ENDPOINTS requerem autenticação (POST /api/acc/media/*)
    </important>
  </action>
  <verify>
    cd app/api && go build -v ./...
  </verify>
  <done>
    Endpoints de upload de logo/fotos para MinIO + perfil público estendido com availability, logo, fotos e posts. Compilação Go sem erros.
  </done>
</task>

<task type="auto">
  <name>Task 3: Frontend — AccountantProfileEdit com upload e disponibilidade</name>
  <files>
    - app/web/src/pages/acc/AccountantProfileEdit.tsx (criar)
    - app/web/src/services/accountant.ts (criar)
    - app/web/src/types/index.ts (atualizar)
  </files>
  <action>
    1. Criar services/accountant.ts com:
       - getMyProfile() → GET /api/acc/profile
       - updateMyProfile(data) → PUT /api/acc/profile
       - uploadLogo(file: File) → POST /api/acc/media/logo (multipart FormData)
       - uploadPhoto(file: File) → POST /api/acc/media/photo (multipart FormData)
       - updateAvailability(status) → PUT /api/acc/profile (incluir availability no payload)

    2. Atualizar types/index.ts:
       - Adicionar campos na interface Accountant: logo_url, photo_urls, availability
       - Criar interface PublicAccountantProfile com todos os campos do perfil público

    3. Criar pages/acc/AccountantProfileEdit.tsx com:
       - Seção de Logo: preview circular, botão de upload, max 5MB
       - Seção de Fotos: grid de thumbnails (max 5), botão adicionar, botão remover
       - Toggle de Disponibilidade: 3 estados (disponivel, parcial, indisponivel) com badges visuais
       - Campos de edição: nome, bio, especialidades, cidade, estado
       - Botão Salvar com loading state
       - Loading state inicial e error state inline (bg-rose-50)
  </action>
  <verify>
    Verificar se os arquivos foram criados corretamente
  </verify>
  <done>
    AccountantProfileEdit.tsx com upload de logo/fotos, toggle de disponibilidade, e serviço accountant.ts criado.
  </done>
</task>

<task type="auto">
  <name>Task 4: Frontend — AccountantPublicProfile com seções completas</name>
  <files>
    - app/web/src/pages/public/AccountantPublicProfile.tsx (criar)
    - app/web/src/services/accountant.ts (atualizar)
  </files>
  <action>
    1. Em services/accountant.ts: adicionar getPublicProfile(slug) → GET /api/public/accountants/{slug}

    2. Criar pages/public/AccountantPublicProfile.tsx com seções na ordem:
       1. Header: logo (esquerda) + foto principal + nome + CRC + cidade/estado + availability badge + CTA "Contratar"
       2. Bio: texto descritivo completo
       3. Especialidades: chips/tags estilizados
       4. Serviços: cards com preço e prazo (dados de /api/acc/servicos do contador ou mock)
       5. Posts: grid 2-col com os posts publicados do contador (cover, title, excerpt, tag, date)
       6. Avaliações: placeholder "Em breve" com teaser visual

       - Loading: spinner centralizado
       - Error: mensagem de erro com bg-rose-50
       - Not Found: mensagem "Perfil não encontrado"

    Usar os mesmos padrões UI de connexo-primitives: Card, Icon, GoldButton, GhostButton, Pill, PageContainer.
    Layout responsivo: header em flex row (logo + info), grid 2-col para posts.
  </action>
  <verify>
    Verificar se os arquivos foram criados corretamente
  </verify>
  <done>
    AccountantPublicProfile.tsx com todas as 6 seções, loading/error states, e layout responsivo.
  </done>
</task>

<task type="auto">
  <name>Task 5: Catálogo atualizado com availability badge + logo</name>
  <files>
    - app/api/internal/handler/catalog.go
    - app/api/internal/repository/user.go
    - app/web/src/pages/cli/CatalogPage.tsx (criar ou atualizar)
  </files>
  <action>
    1. Em user.go: atualizar Accountant struct e ListPublicAccountants query para incluir:
       - logo_url (COALESCE)
       - availability (COALESCE com default 'disponivel')
       - Filtrar por availability se passado como query param

    2. Em catalog.go: adicionar suporte a query param ?availability=disponivel

    3. Criar pages/cli/CatalogPage.tsx:
       - Grid de cards de contadores
       - Cada card mostra: logo (thumbnail), nome, especialidade, cidade/estado, availability badge
       - Badge de disponibilidade:
         - 'disponivel' → badge verde "Disponível"
         - 'parcial' → badge âmbar "Disponibilidade Limitada"
         - 'indisponivel' → badge cinza "Indisponível"
       - Filtro por disponibilidade no sidebar
       - Loading state: spinner
       - Empty state: "Nenhum contador encontrado"
  </action>
  <verify>
    cd app/api && go build -v ./...
  </verify>
  <done>
    Catálogo exibindo availability badge + logo nos cards, com filtro por disponibilidade. Compilação Go sem erros.
  </done>
</task>

</tasks>

## ✅ Verification
- Backend: cd app/api && go build -v ./...
- Frontend: arquivos criados e atualizados corretamente

## 📅 Dependencies
- Phase 7: MinIO SDK, DocumentRepository, proxy /api/media/
- Phase 8: DeliverableRepository pattern
