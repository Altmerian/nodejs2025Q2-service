# Project TODO Tracker

> Progress checklist corresponding to `/docs/implementation-plan.md`.

## Phase Checklist
- [ ] Phase 1 – Custom LoggingService
  - [ ] Implement `LoggingService` & `LoggingModule`
  - [ ] Expose logging env vars (`LOG_LEVEL`, `LOG_DIR`, `LOG_MAX_SIZE_KB`) via `ConfigService`
- [ ] Phase 2 – Request / Response Logging
  - [ ] Build `RequestLoggingMiddleware`
  - [ ] Build `ResponseLoggingInterceptor`
- [ ] Phase 3 – Unified Exception Handling
  - [ ] Inject `LoggingService` into `HttpExceptionFilter`
  - [ ] Add `uncaughtException` / `unhandledRejection` listeners
- [ ] Phase 4 – Auth Module Scaffolding
  - [ ] Create `AuthModule`, DTOs, controller & service
  - [ ] `/auth/signup` & `/auth/login` routes functional
- [ ] Phase 5 – JWT Generation & Protection
  - [ ] Implement JWT issuing & verification (access / refresh)
  - [ ] Add `JwtAuthGuard` & global guard exclusions
  - [ ] Expose JWT env vars via `ConfigService`
  - [ ] `/auth/refresh` functional
- [ ] Phase 6 – Final Integration & Cleanup
  - [ ] Auto-create `logs` dir on startup
  - [ ] Run e2e suite & fix lint issues
  - [ ] Update README with usage & env variables

## Notes
- Keep rotated log files ≤ 10.
- All new env variables added to `.env.example`.
- The same variable should be copied to `.env`.
- after each implementation step make sure tests pass. Run appropriate npm script to run e2e tests and lint. Check the app is up and running on docker before running tests.

*Last updated: 2025-06-12*
