# Docker Setup Instructions

This document provides minimal instructions for running the Home Library Service using Docker.
There are two Docker Compose files:
- `docker-compose.dev.yml` for development (uses `Dockerfile.dev` with hot reloading support)
- `docker-compose.yml` for production (uses `Dockerfile` for optimized image size <500MB)

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- Docker Hub account (for pushing images)

## Quick Start

### Development Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Build and start the development containers:
   ```bash
   npm run docker:build:dev
   npm run docker:up:dev
   ```

3. The application will be available at http://localhost:4000
   - Database migrations run automatically on startup
   - Hot reloading is enabled for development
   - Prisma client is generated during build

4. Run tests against the running containers:
   ```bash
   npm run test
   ```

5. Stop the containers:
   ```bash
   npm run docker:down:dev
   ```

### Production Environment

1. Update the `.env` file with your production values.

2. Build and start the production containers:
   ```bash
   npm run docker:build
   npm run docker:up
   ```

3. Stop the containers:
   ```bash
   npm run docker:down
   ```

## Environment Variables for Docker Containers

The following environment variables are required:

```env
# Application
PORT=4000
NODE_ENV=production|development

# Database
DATABASE_URL=postgresql://username:password@db:5432/database_name
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=database_name
POSTGRES_PORT=5432

# Security
CRYPT_SALT=10
```

## Important Notes

### Database Migrations
- All `npm start` commands automatically run `prisma migrate deploy` before starting
- Migrations are applied safely in production mode (no schema changes)
- To skip migrations, use `npm run start:prod:no-migrate`

### Build Process
- The build process includes `npm run db:generate` to ensure Prisma client is available
- Development uses `Dockerfile.dev` with hot reloading support
- Production uses multi-stage `Dockerfile` for optimized image size (<500MB)

## Docker Hub Deployment

### Prerequisites
1. Docker Hub account
2. IMPORTANT: Set your Docker Hub username as env variable: `export DOCKER_USERNAME=your-username`
3. Login to Docker Hub: `docker login`

### Build and Push

```bash
# Build production image
npm run docker:build:prod

# Push to your Docker Hub repository
npm run docker:push:tagged

# Or use automated script
./docker-hub-deploy.sh
```

### Security Scanning

Before deployment, run security scans:
```bash
npm run security:check
npm run security:report
```

Reports are generated in `logs/` directory.

### Image Management

Check images:
```bash
docker images | grep home-library
```

Clean up:
```bash
docker builder prune
```