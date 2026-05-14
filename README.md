# Nightfall Terrace

Flattened repo:

- `web/`: Next.js (runs on `http://localhost:3000`)
- `api/`: NestJS (runs on `http://localhost:3001`)

## Requirements

- Node.js 20+
- PostgreSQL running locally on `localhost:5432`

## Database (local Postgres, no Docker)

This project uses:

- DB: `reservenow`
- user: `postgres`
- password: `postgres`

One-time setup:

```bash
psql -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE reservenow;" || true
psql -h localhost -p 5432 -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

Connection string (see `.env.example`):

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/reservenow
```

## Install

From repo root:

```bash
npm install
```

## Run

From repo root:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:web
```

```bash
npm run dev:api
```

