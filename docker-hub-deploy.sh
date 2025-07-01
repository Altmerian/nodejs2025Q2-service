#!/bin/bash

# Docker Hub Deployment Script for Home Library Service
# This script builds and pushes the application to Docker Hub
#
# Usage:
#   ./docker-hub-deploy.sh                    # Uses DOCKER_USERNAME from environment
#   ./docker-hub-deploy.sh your-username      # Uses your Docker Hub username
#   DOCKER_USERNAME=your-username ./docker-hub-deploy.sh

set -e

echo "🐳 Home Library Service - Docker Hub Deployment"
echo "=============================================="

# Determine Docker username
if [ -n "$1" ]; then
    DOCKER_USERNAME="$1"
    echo "📝 Using Docker username from argument: $DOCKER_USERNAME"
elif [ -n "$DOCKER_USERNAME" ]; then
    echo "📝 Using Docker username from environment: $DOCKER_USERNAME"
else
    echo "❌ Docker username not provided"
    echo "Usage:"
    echo "  ./docker-hub-deploy.sh your-username"
    echo "  DOCKER_USERNAME=your-username ./docker-hub-deploy.sh"
    exit 1
fi

# Function to test Docker Hub authentication
test_docker_auth() {
    echo "🔍 Testing Docker Hub authentication..."
    
    # Try to get auth info for Docker Hub
    if docker system info --format '{{.RegistryConfig.IndexConfigs}}' 2>/dev/null | grep -q "docker.io"; then
        # Try a simple operation that requires auth (like searching)
        if docker search --limit 1 hello-world >/dev/null 2>&1; then
            echo "✅ Docker Hub authentication verified"
            return 0
        fi
    fi
    
    return 1
}

# Check authentication or prompt for login
if ! test_docker_auth; then
    echo "⚠️  Docker Hub authentication required"
    echo "🔐 Attempting to log in to Docker Hub..."
    
    if ! docker login; then
        echo "❌ Docker login failed"
        exit 1
    fi
    
    echo "✅ Successfully logged in to Docker Hub"
else
    echo "✅ Already authenticated with Docker Hub"
fi

# Build the production image with timestamp tag
echo ""
echo "🔨 Building production image..."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

docker build -t ${DOCKER_USERNAME}/home-library-app:latest -t ${DOCKER_USERNAME}/home-library-app:$TIMESTAMP .

echo "✅ Built images:"
echo "   - ${DOCKER_USERNAME}/home-library-app:latest"
echo "   - ${DOCKER_USERNAME}/home-library-app:$TIMESTAMP"

# Show image sizes
echo ""
echo "📏 Image sizes:"
docker images | grep ${DOCKER_USERNAME}/home-library-app | head -2

# Push to Docker Hub
echo ""
echo "🚀 Pushing to Docker Hub..."
docker push ${DOCKER_USERNAME}/home-library-app:latest
docker push ${DOCKER_USERNAME}/home-library-app:$TIMESTAMP

echo ""
echo "🎉 Successfully deployed to Docker Hub!"
echo "   Repository: https://hub.docker.com/r/${DOCKER_USERNAME}/home-library-app"
echo "   Latest tag: ${DOCKER_USERNAME}/home-library-app:latest"
echo "   Timestamped: ${DOCKER_USERNAME}/home-library-app:$TIMESTAMP"