# =============================================================================
# ACQUISITIONS - Dockerfile
# Multi-stage build for development and production
# =============================================================================

# -----------------------------------------------------------------------------
# Base stage: Common Node.js setup
# -----------------------------------------------------------------------------
FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# -----------------------------------------------------------------------------
# Development stage
# -----------------------------------------------------------------------------
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run in development mode with watch
CMD ["npm", "run", "dev"]

# -----------------------------------------------------------------------------
# Production dependencies stage
# -----------------------------------------------------------------------------
FROM base AS prod-deps

# Install only production dependencies
RUN npm ci --omit=dev

# -----------------------------------------------------------------------------
# Production stage
# -----------------------------------------------------------------------------
FROM node:22-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies from prod-deps stage
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy application source code
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs drizzle.config.js ./
COPY --chown=nodejs:nodejs drizzle ./drizzle
COPY --chown=nodejs:nodejs src ./src

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
