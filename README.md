# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager (v22.14.0 or higher).
- Docker - [Download & Install Docker](https://docs.docker.com/engine/install/) (for containerized deployment).
- Docker Compose - [Download & Install Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher).

## Downloading

```
git clone {repository URL}
```

## Running with Docker (Recommended)

check [DOCKER.md](./DOCKER.md) for detailed instructions.

### Quick Start - Development

```bash
# Copy environment variables
cp .env.example .env

# Build and start development containers
npm run docker:build:dev
npm run docker:up:dev

# Application will be available at http://localhost:4000
# View logs
npm run docker:logs:dev

# Stop containers
npm run docker:down:dev
```

### Production Deployment

```bash
# Edit .env with your production values

# Build and start production containers
npm run docker:build
npm run docker:up

# Stop containers
npm run docker:down
```

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md).

## Running without Docker (Development, requires PostgreSQL on port 5432)

### Installing NPM modules

```
npm install
```

### Building application

```
npm run build
```

### Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

### Using Swagger UI with Authentication
1. Open http://localhost:4000/doc in your browser
2. Use the **Authentication** endpoints to sign up and login:
   - `POST /auth/signup` - Create a new user account
   - `POST /auth/login` - Login and copy the `accessToken` from the response
3. Click the **"Authorize"** button at the top of the Swagger page
4. Paste the access token in the "Value" field (without "Bearer " prefix)
5. Click **"Authorize"** and then **"Close"**
6. Now you can test all protected endpoints directly from Swagger UI

## Authentication & Authorization

The service uses JWT (JSON Web Token) authentication for protecting endpoints.

### Public Endpoints (No Authentication Required)
- `GET /` - Root endpoint
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh tokens
- `GET /doc` - Swagger documentation

### Protected Endpoints (Authentication Required)
All other endpoints require a valid JWT access token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Authentication Flow
1. **Sign up**: Create a new user account via `POST /auth/signup`
2. **Login**: Authenticate with credentials via `POST /auth/login` to receive access and refresh tokens
3. **Access protected resources**: Include the access token in the Authorization header
4. **Refresh tokens**: When access token expires, use refresh token via `POST /auth/refresh` to get new tokens

### Token Configuration
Configure JWT tokens in your `.env` file:
```
JWT_SECRET_KEY=your-secret-key
JWT_SECRET_REFRESH_KEY=your-refresh-secret-key
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
```

## Testing

**Important**: Tests require a clean database state. If tests fail with 409 Conflict errors, clear the database first.

### Prerequisites for Testing
- Application must be running (use Docker or local setup)
- Database should be in clean state for reliable test results
- Authentication is now implemented - some tests require JWT tokens

### Test Commands

```bash
# Run basic tests (these expect no authentication and will fail with 401 after auth implementation)
npm run test

# Run authentication tests (verify endpoints return 401 without tokens)
npm run test:auth

# Run refresh token tests
npm run test:refresh

# Run specific test suite
npm run test -- <path to suite>
```

### Test Structure
- `test/*.e2e.spec.ts` - Basic endpoint tests (written before authentication)
- `test/auth/*.e2e.spec.ts` - Authentication tests (verify 401 responses without tokens)

**Note**: After implementing JWT authentication, the basic tests (`npm run test`) will fail with 401 errors because they don't include authentication tokens. This is expected behavior. The auth tests (`npm run test:auth`) verify that endpoints properly require authentication.

### Database Testing Notes

**PostgreSQL Data Persistence**: Unlike in-memory storage, PostgreSQL retains data between test runs. This can cause:
- **409 Conflict errors** when tests try to create users with existing logins
- **Test failures** due to unexpected existing data
- **Inconsistent test results** without proper cleanup

**Before Running Tests**: If you encounter 409 Conflict errors or test failures, clear the database:

```bash
# Reset database to clean state (removes all data and reapplies migrations)
npm run db:reset

# Quick reset without confirmation (recommended for development)
npm run db:reset:force
```

## Logging

The service includes comprehensive logging functionality for monitoring and debugging.

### Log Configuration
Configure logging in your `.env` file:
```
LOG_LEVEL=log           # Options: error, warn, log, debug, verbose
LOG_DIR=logs           # Directory for log files
LOG_MAX_SIZE_KB=100    # Maximum log file size in KB before rotation
```

### Log Features
- **Request/Response Logging**: All HTTP requests and responses are logged with method, URL, status code, and duration
- **Error Logging**: All errors are logged with stack traces
- **File Rotation**: Log files are automatically rotated when they exceed the configured size
- **Separate Error Log**: Errors are written to both the main log and a separate `error.log` file
- **Maximum 10 Files**: Only the 10 most recent application log files are retained

### Log Files
- `logs/YYYYMMDD-HHMMSS-app.log` - Main application logs (rotated)
- `logs/error.log` - Error-only log file
- `logs/security-audit.log` - Security audit results (retained)
- `logs/docker-scan.log` - Docker security scan results (retained)

### Log Levels
The logging system follows NestJS log levels (from highest to lowest priority):
1. **fatal** (0) - System is unusable
2. **error** (1) - Error conditions
3. **warn** (2) - Warning conditions
4. **log** (3) - Normal but significant conditions (default)
5. **debug** (4) - Debug-level messages
6. **verbose** (5) - Detailed information

Setting a log level will include all messages at that level and higher priority levels.

## API Documentation

Folder [doc](doc) contains OpenAPI documentation in YAML format:
- `api-generated.yaml` - generated by NestJS Swagger module.
- `api.yaml` - initial documentation file adjusted to match the implementation.

To generate documentation run:

### Schema Management

```bash
# Generate Prisma client from schema
npm run db:generate

# Clean generated files (Prisma clients)
npm run db:clean
```
npm run build
```

## Database Scripts

### Schema Management

```bash
# Generate Prisma client from schema
npm run db:generate

# Clean generated files (Prisma clients)
npm run db:clean
```

### Development Database

```bash
# Create and apply new migration
npm run db:migrate

# Push schema changes to database (prototyping)
npm run db:push

# Reset database and apply all migrations (⚠️  REMOVES ALL DATA)
npm run db:reset

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database browser)
npm run db:studio
```

### Database Management

```bash
# Clear all data and reset to clean state (recommended before testing)
npm run db:reset

# Clear database without confirmation prompt (for scripts/automation)
npm run db:reset:force

# Deploy migrations only (production-safe)
npm run db:migrate:deploy

# Generate Prisma client after schema changes
npm run db:generate
```

### Database Seeding

The application includes a comprehensive seeding script that populates the database with realistic sample data for development and testing.

#### Seeding Data

```bash
# Populate database with sample data
npm run db:seed
```

#### Common Seeding Workflows

```bash
# Populate with sample data (clears existing data automatically)
npm run db:seed

# Seed and run tests
npm run db:seed && npm test

# Quick development setup
npm run docker:up:dev && npm run db:seed

# Only use db:reset if you need to reset schema/migrations
npm run db:reset && npm run db:seed
```

**⚠️ Important Notes**:
- Database scripts require PostgreSQL connection except for `db:clean`
- `db:reset` **REMOVES ALL DATA** - use with caution
- `db:seed` clears existing data before seeding to prevent conflicts
- All `start` scripts automatically run database migrations before starting
- Use `start:prod:no-migrate` if you need to skip migrations
- For testing, always start with a clean database using `npm run db:reset`

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
