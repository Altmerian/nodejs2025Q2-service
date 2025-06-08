# Multi-stage build for optimized production image
# Build stage
FROM node:22.14-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy TypeScript configuration and source code
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client and build the application
RUN npx prisma generate && npm run build

# Production stage
FROM node:22.14-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema and migrations for runtime
COPY prisma ./prisma

# Install only production dependencies and clean cache in same layer
RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 4000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application with migrations
CMD ["npm", "run", "start:prod"]