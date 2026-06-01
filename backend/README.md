# Backend — REST API

Node.js + Express + MongoDB API with JWT auth and RBAC.

## Quick start

```bash
npm install
cp .env.example .env
npm run seed:admin
npm run dev
```

## Endpoints

Base path: `/api/v1`

- **Auth:** `/auth/register`, `/auth/login`, `/auth/me`
- **Tasks:** `/tasks` (CRUD, JWT required)
- **Users:** `/users` (admin only)

Full table: [../README.md](../README.md#api-reference-v1)

## Architecture

```
routes/v1 → controllers → services → models (Mongoose)
                ↓
         middleware (auth, authorize, validate, errors)
```

Add new features by creating model + service + controller + validator + route under `src/routes/v1/`.
