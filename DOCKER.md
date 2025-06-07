# Docker Setup Instructions

This document provides minimal instructions for running the Home Library Service using Docker.

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

4. Stop the containers:
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