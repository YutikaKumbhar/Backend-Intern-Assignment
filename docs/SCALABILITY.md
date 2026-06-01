# Scalability Notes

## Current architecture

```
Client (React) → Express API (v1) → MongoDB
                      ↓
              services / controllers / models
```

- **API versioning** (`/api/v1`) lets you ship breaking changes under `/api/v2` without downtime for old clients.
- **Layered backend** (`routes` → `controllers` → `services` → `models`) makes it easy to extract a service later.

---

## 1. Horizontal scaling & load balancing

**Problem:** One Node process handles limited concurrent connections.

**Approach:**

- Run **multiple instances** of the same API behind a **load balancer** (Nginx, AWS ALB, or Kubernetes Ingress).
- Use **stateless** JWT auth (already stateless—no server-side sessions), so any instance can serve any request.
- Enable **sticky sessions** only if you add server-side sessions later (not required today).

```
                    ┌─────────────┐
  Clients ─────────►│ Load balancer│
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
      API instance 1  instance 2  instance 3
           └───────────────┬───────────────┘
                           ▼
                      MongoDB (+ replica set)
```

---

## 2. Caching

**Problem:** Repeated reads (task lists, user profile) hit the database on every request.

**Approach:**

| Layer | Tool | Use case |
|-------|------|----------|
| **HTTP** | `Cache-Control`, ETags | Public/static responses |
| **Application** | **Redis** | Cache `GET /tasks` lists, user profile by id; invalidate on create/update/delete |
| **Database** | MongoDB indexes | `owner` on tasks (already indexed), compound indexes for filters |

Example flow: on `GET /tasks`, check Redis key `tasks:user:{userId}:page:1`; on `POST/PATCH/DELETE`, delete matching keys.

---

## 3. Database scaling

- **MongoDB replica set** — high availability and read scaling (secondary reads for reports).
- **Sharding** — when a single replica set is too large (shard by `owner` for tasks).
- **Connection pooling** — Mongoose pools connections; tune `maxPoolSize` under heavy load.

---

## 4. Microservices (future split)

When teams or traffic grow, split by **bounded context** without changing the frontend contract immediately:

| Service | Responsibility |
|---------|----------------|
| **Auth service** | Register, login, JWT issue/validate |
| **Task service** | Task CRUD |
| **User/admin service** | User list, roles (or fold into Auth) |

**Communication:** REST or message queue (RabbitMQ, SQS) for async events (e.g. `UserRegistered`).

**API gateway:** Single entry (`api.example.com`) routes `/auth/*`, `/tasks/*` to the right service and validates JWT at the edge.

Start as a monolith; extract **Auth** or **Tasks** first when one area changes most often or needs independent deploy cadence.

---

## 5. Other production practices

- **Rate limiting** — already on `/api` and auth routes; tighten per-IP or per-user in Redis for multi-instance deploys.
- **CDN** — serve React `build/` from CloudFront / Cloudflare.
- **Observability** — structured logs (Winston/Pino), metrics (Prometheus), tracing (OpenTelemetry).
- **Secrets** — JWT secret and DB URI from vault/env, not committed (see `.env.example`).

