# Deploy — servidor hetzner

Stack do Connexo isolada das demais aplicações do servidor (`paginas_melque`,
`crm_escritorio`, `claw`, `npm`).

- **Local:** `/root/projetos/connexo` (mesmo padrão dos outros projetos)
- **Projeto compose:** `connexo`
- **Domínio:** `connexo.ad.vlog.br`
- **Containers:** `connexo-db`, `connexo-minio`, `connexo-api`, `connexo-web`

## Isolamento

Nenhuma porta é publicada no host — não há como colidir com os serviços já
existentes. O Nginx Proxy Manager alcança `connexo-web:80` pela rede externa
`proxy`, que é a mesma convenção usada por `paginas_melque-web-1` e `crm-site`.

Banco, MinIO e API ficam apenas na rede `internal` do projeto: não são
acessíveis nem do host nem dos outros containers.

## Primeiro deploy

```bash
git clone https://github.com/melquetaleques/connexo.git /root/projetos/connexo
cd /root/projetos/connexo
cp deploy/hetzner/.env.example .env
# preencher os segredos (openssl rand -hex 64 etc.)
docker compose -f deploy/hetzner/docker-compose.yml --env-file .env up -d --build
```

As migrations rodam sozinhas no start da API (`db/migrations/*.sql`, aplicadas
em transação e registradas em `schema_migrations`).

## Atualizar

```bash
cd /root/projetos/connexo
git pull
docker compose -f deploy/hetzner/docker-compose.yml --env-file .env up -d --build
```

## Nginx Proxy Manager

Proxy host apontando para `connexo-web`, porta `80`, com Websockets ligado e
SSL via Let's Encrypt. O `/api` é resolvido dentro do próprio container web
(`app/web/nginx.conf` faz proxy para `connexo-api:8080`), então o NPM só precisa
conhecer um destino.

## Verificação

```bash
docker compose -f deploy/hetzner/docker-compose.yml ps
docker exec connexo-api wget -qO- http://localhost:8080/api/health
curl -sI https://connexo.ad.vlog.br
```

## Rollback

```bash
cd /root/projetos/connexo
git log --oneline -5
git checkout <commit-anterior>
docker compose -f deploy/hetzner/docker-compose.yml --env-file .env up -d --build
```

Os volumes `connexo_pgdata` e `connexo_miniodata` sobrevivem ao rollback —
para descartar dados é preciso remover os volumes explicitamente.
