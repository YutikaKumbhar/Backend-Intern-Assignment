# REST API with JWT, RBAC & React UI

Scalable **REST API** with **JWT authentication**, **role-based access control** (user/admin), **task CRUD**, API versioning, validation, and a **React** frontend for end-to-end testing. Includes a **Postman collection** and scalability notes for production growth.

---
## Deliverables

| Item | Details |
|------|---------|
| **Backend** | `backend/` — Express, MongoDB, bcrypt, JWT, RBAC |
| **Auth APIs** | Register, login, profile (`/api/v1/auth/*`) |
| **CRUD APIs** | Tasks (`/api/v1/tasks/*`) |
| **Frontend** | `frontend/` — register, login, dashboard, task CRUD |
| **API docs** | `postman/REST-API-RBAC.postman_collection.json` |
| **Scalability** | [`docs/SCALABILITY.md`](docs/SCALABILITY.md) — load balancing, caching, microservices |

See [`DELIVERABLES.md`](DELIVERABLES.md) for the full checklist.

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Backend | Node.js, Express, JavaScript |
| Database | MongoDB (Mongoose) |
| Auth | bcrypt + JWT |
| Frontend | React, Vite, JavaScript |
| Docs | Postman collection |

---

## Setup & run

### 1. Clone (after publishing to GitHub)

```bash
git clone https://github.com/YutikaKumbhar/rest-api-rbac.git 
cd rest-api-rbac
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # Windows: copy .env.example .env
npm install
npm run seed:admin      # admin@example.com / AdminPass123
npm run dev
```

Server: **http://localhost:5000**  
API base: **http://localhost:5000/api/v1**

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI: **http://localhost:5173**

### 4. Postman

1. Import `postman/REST-API-RBAC.postman_collection.json`
2. Optional: import `postman/REST-API-RBAC.postman_environment.json`
3. Run **Health Check**, then **Auth → Login**

Details: [`postman/README.md`](postman/README.md)

---

## API reference (v1)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/health` | Public | Health check |
| POST | `/api/v1/auth/register` | Public | Register user |
| POST | `/api/v1/auth/login` | Public | Login → JWT |
| GET | `/api/v1/auth/me` | JWT | Current user |
| GET | `/api/v1/tasks` | JWT | List tasks (own; admin: all) |
| POST | `/api/v1/tasks` | JWT | Create task |
| GET | `/api/v1/tasks/:id` | JWT | Get task |
| PATCH | `/api/v1/tasks/:id` | JWT | Update task |
| DELETE | `/api/v1/tasks/:id` | JWT | Delete task |
| GET | `/api/v1/users` | Admin | List users |
| PATCH | `/api/v1/users/:id/role` | Admin | Change role |
| PATCH | `/api/v1/users/:id/active` | Admin | Activate/deactivate |

**Auth header:** `Authorization: Bearer <token>`

---

## Roles

| Role | Permissions |
|------|-------------|
| **user** | CRUD on own tasks only |
| **admin** | All tasks + user management |

New registrations are always **user**. Use `npm run seed:admin` or an admin to promote roles.

---

## Database schema

Defined in Mongoose models:

- **users** — `backend/src/models/User.js` (`name`, `email`, `password`, `role`, `isActive`, timestamps)
- **tasks** — `backend/src/models/Task.js` (`title`, `description`, `status`, `owner`, timestamps)

Database name: `rest_api_rbac` (from `MONGODB_URI`).

Inspect data: `mongosh` → `use rest_api_rbac` → `db.users.find()` / `db.tasks.find()`

---

## Security

- Password hashing (bcrypt, 12 rounds)
- JWT bearer tokens
- Helmet, CORS, rate limiting
- Input validation & sanitization (`express-mongo-sanitize`, `xss-clean`)
- Centralized error handler

---

## Environment variables

**Backend** (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Signing secret (use a long random value in production) |
| `JWT_EXPIRES_IN` | Token TTL (e.g. `7d`) |
| `CORS_ORIGIN` | Frontend URL (e.g. `http://localhost:5173`) |

**Frontend** (`frontend/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base (e.g. `http://localhost:5000/api/v1`) |

Never commit `.env` files (see `.gitignore`).

---

## Scalability

See **[`docs/SCALABILITY.md`](docs/SCALABILITY.md)** for:

- Load balancing & horizontal scaling
- Redis caching
- MongoDB replica sets / sharding
- Evolving to microservices (auth, tasks, gateway)
