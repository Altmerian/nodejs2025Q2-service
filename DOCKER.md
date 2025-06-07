# Docker Setup Instructions

This document provides instructions for running the Home Library Service using Docker.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- Docker Hub account (optional, for pushing images)

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

3. The application will be available at:
   - Application: http://localhost:4000
   - PostgreSQL: localhost:5432
   - Debug port: localhost:9229

4. View logs:
   ```bash
   npm run docker:logs:dev
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

3. View logs:
   ```bash
   npm run docker:logs
   ```

4. Stop the containers:
   ```bash
   npm run docker:down
   ```

## Features

### Development Features
- **Hot Reloading**: Source code changes in the `src` folder automatically restart the application
- **Volume Mounting**: Local `src` and `test` directories are mounted for live updates
- **Debug Port**: Port 9229 is exposed for Node.js debugging
- **Separate Network**: Uses `home-library-network-dev` for isolation

### Production Features
- **Multi-stage Build**: Optimized image size using Alpine Linux
- **Non-root User**: Application runs as unprivileged user for security
- **Health Checks**: Both database and application have health check configurations
- **Auto-restart**: Containers automatically restart on failure
- **Data Persistence**: PostgreSQL data and logs are stored in named volumes

## Docker Commands

### Using npm scripts
```bash
# Development
npm run docker:build:dev    # Build development images
npm run docker:up:dev       # Start development containers
npm run docker:down:dev     # Stop development containers
npm run docker:logs:dev     # View development logs

# Production
npm run docker:build        # Build production images
npm run docker:up           # Start production containers
npm run docker:down         # Stop production containers
npm run docker:logs         # View production logs
```

### Using docker-compose directly
```bash
# Development
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose build
docker-compose up -d
docker-compose down
```

## Environment Variables

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
JWT_SECRET_KEY=your_secret_key
JWT_SECRET_REFRESH_KEY=your_refresh_secret_key
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
```

## Volumes

The following named volumes are created:

- `home-library-postgres-data`: PostgreSQL data files
- `home-library-postgres-logs`: PostgreSQL log files
- `home-library-postgres-data-dev`: Development PostgreSQL data
- `home-library-postgres-logs-dev`: Development PostgreSQL logs

## Networks

- `home-library-network`: Production network
- `home-library-network-dev`: Development network

## Troubleshooting

### Container won't start
- Check if ports 4000 and 5432 are already in use
- Verify environment variables are properly set
- Check container logs: `docker-compose logs`

### Database connection issues
- Ensure the database container is healthy: `docker-compose ps`
- Verify DATABASE_URL uses `db` as hostname (not localhost)
- Check PostgreSQL logs: `docker-compose logs db`

### Hot reloading not working
- Ensure you're using the development compose file
- Check volume mounts are correct
- Verify file permissions on the host system

### Permission issues
- The application runs as non-root user (nodejs:1001)
- Ensure mounted volumes have appropriate permissions