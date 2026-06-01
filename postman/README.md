# API Documentation (Postman)

## Import

1. Open **Postman** → **Import**
2. Select `REST-API-RBAC.postman_collection.json`
3. Optional: import `REST-API-RBAC.postman_environment.json` for `baseUrl` and `token`

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `baseUrl` | `http://localhost:5000/api/v1` | API root |
| `token` | (empty) | Set automatically after **Login** or **Register** |
| `taskId` | (empty) | Set after **Create Task** |
| `userId` | (manual) | Copy from **List Users** for admin routes |

## Recommended test flow

1. **Health → Health Check** (no auth)
2. **Auth → Login** (admin: `admin@example.com` / `AdminPass123` after `npm run seed:admin`)
3. **Auth → Get Me**
4. **Tasks → Create Task** → **List Tasks** → **Get Task** → **Update Task** → **Delete Task**
5. **Users (Admin) → List Users** (admin token only)

## Auth header

Protected requests use:

```
Authorization: Bearer {{token}}
```

## Error format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "..." }]
}
```
