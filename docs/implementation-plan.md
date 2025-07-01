# Implementation Plan: Logging, Error Handling, Authentication & Authorization

> **Scope** – Implements requirements from `docs/task-requirements.md` & `docs/current-task.md`.
> Node.js 22.x, NestJS 10. Only `@nestjs/common` & `@nestjs/core` for logging/error-handling.

---
## High-Level Sequence
1. **Logging / Error-handling foundation** – global impact.
2. **Auth (signup / login / refresh)** – new routes & guards.
3. **Configuration tidy-up / polish** – env integration, cleanup.

---
## Chunked Steps & Deliverables

### Phase 1 – Custom `LoggingService`
* **Files**: `src/logging/logging.service.ts`, `src/logging/logging.module.ts` (global).
* Features:
  * Log levels (`error`, `warn`, `log`, `debug`, `verbose`) mapped to numeric values.
  * Outputs to `stdout` and rotating files.
  * File naming: `[YYYYMMDD-HHMMSS]-app.log`, `error.log`.
  * Rotation by size (env `LOG_MAX_SIZE_KB`, default `100`).
  * Keep **max 10** rotated files (delete oldest).
  * Expose new logging env vars via existing `ConfigService`.
* **Env additions** (added to `.env.example`):
  ```
  # Logging
  LOG_LEVEL=log
  LOG_DIR=logs
  LOG_MAX_SIZE_KB=100
  ```
* Deliverable: LoggingService & module registered; no request integration yet.

---
### Phase 2 – Request / Response Logging
* **Middleware** `RequestLoggingMiddleware` – logs method, url, query, body at `log` level.
* **Interceptor** `ResponseLoggingInterceptor` – logs status & duration when response sent.
* Uses `LoggingService`; registered globally in `main.ts`.
* Deliverable: All traffic logged.

---
### Phase 3 – Unified Exception Handling
* Inject `LoggingService` into existing `HttpExceptionFilter` to log errors.
* Add `process.on('uncaughtException')` & `process.on('unhandledRejection')` in `main.ts` (delegating to logger).
* Ensure unexpected errors = HTTP 500 with standard message.
* Deliverable: Consistent error flow with logging.

---
### Phase 4 – Auth Module Scaffolding
* Folder `src/auth/` with `AuthModule`, `AuthService`, `AuthController`.
* DTOs: `SignupDto`, `LoginDto`, `RefreshDto`.
* Signup – uses `UserService.create` (password hashed by existing `PasswordService`).
* Login – verify password, issue JWT pair.
* Deliverable: `/auth/signup` & `/auth/login` routes functional.

---
### Phase 5 – JWT Generation & Protection
* Use `@nestjs/jwt` internally (already dependency).
* Stateless refresh token: verify signature/expiry only, then issue new pair.
* **Guard** `JwtAuthGuard` + Passport strategy.
* **Global Guard** via `APP_GUARD`, skipping routes: `/`, `/doc`, `/auth/*` (use custom decorator or reflector).
* **Env vars** (already in `.env.example`):
  ```
  # Security
  CRYPT_SALT=10
  JWT_SECRET_KEY=secret123123
  JWT_SECRET_REFRESH_KEY=secret123123
  TOKEN_EXPIRE_TIME=1h
  TOKEN_REFRESH_EXPIRE_TIME=24h
  ```
* Expose JWT env vars via `ConfigService` (extend configuration).
* Deliverable: Access protection; `/auth/refresh` returns new tokens.

---
### Phase 6 – Final Integration & Cleanup
* Ensure `logs` directory is auto-created on startup if missing.
* Verify e2e suite passes; lint fixes.
* Update README (if exists) with how to run & env variables.
* Deliverable: Project ready, complies with requirements.

---
## Summary of Env Variables
| Variable | Purpose | Default |
|----------|---------|---------|
| PORT | App port | 4000 |
| NODE_ENV | Environment | development |
| LOG_LEVEL | Min log level | log |
| LOG_DIR | Directory for log files | logs |
| LOG_MAX_SIZE_KB | Rotate when file exceeds size (KB) | 100 |
| CRYPT_SALT | bcrypt salt rounds | 10 |
| JWT_SECRET_KEY | JWT access secret | secret123123 |
| JWT_SECRET_REFRESH_KEY | JWT refresh secret | secret123123 |
| TOKEN_EXPIRE_TIME | Access token TTL | 1h |
| TOKEN_REFRESH_EXPIRE_TIME | Refresh token TTL | 24h |

---
### Acceptance Checklist
- [ ] All steps implemented & committed.
- [ ] Logs created, rotation works, max 10 files retained.
- [ ] All endpoints return correct status & body per spec.
- [ ] Unauthorized access to protected routes returns 401.
- [ ] E2E tests pass.
- [ ] `.env.example` updated.

---
*Prepared ─ 2025-06-12*
