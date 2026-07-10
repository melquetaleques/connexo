.PHONY: dev dev-api dev-web build build-api build-web test-api tidy docker-up docker-down

# Em ambientes com GNU Make: make -j2 dev-api dev-web
dev:
	@echo "Inicie API e Web em terminais separados: make dev-api | make dev-web"
	@echo "Ou em paralelo (GNU Make): make -j2 dev-api dev-web"

dev-api:
	cd api && go run ./cmd/server

dev-web:
	cd web && npm run dev

build: build-api build-web

build-api:
	cd api && mkdir -p bin && go build -o bin/server ./cmd/server && go build -o bin/worker ./cmd/worker

build-web:
	cd web && npm run build

test-api:
	cd api && go test ./...

tidy:
	cd api && go mod tidy

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down
