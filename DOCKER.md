# Docker Setup for ACQUISITIONS

This document explains how to run the application using Docker in both development and production environments.

## Overview

| Environment | Database | Compose File | Env File |
|------------|----------|--------------|----------|
| Development | Neon Local (ephemeral branches) | `docker-compose.dev.yml` | `.env.development` |
| Production | Neon Cloud (direct connection) | `docker-compose.prod.yml` | `.env.production` |

## Prerequisites

- Docker and Docker Compose installed
- A [Neon](https://neon.tech) account with a project created
- Neon API Key (from Account Settings → API Keys)

## Development Setup (Neon Local)

Neon Local creates **ephemeral database branches** that are automatically created when you start the container and deleted when you stop it. This gives you a fresh copy of your database for each development session.

### 1. Configure Environment

Copy and edit the development environment file:

```bash
cp .env.development .env.development.local
```

Fill in the required values in `.env.development.local`:

```bash
# Get these from https://console.neon.tech/
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_parent_branch_id_here  # Usually your main branch

# Other required values
JWT_SECRET=your_dev_jwt_secret
ARCJET_KEY=your_arcjet_key
```

**How to find these values:**
- **NEON_API_KEY**: Account Settings → API Keys → Create new key
- **NEON_PROJECT_ID**: Project Settings → General → Project ID
- **PARENT_BRANCH_ID**: Project → Branches → Select branch → Copy Branch ID

### 2. Start Development Environment

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development.local up --build
```

This will:
1. Start the Neon Local proxy container
2. Create an ephemeral branch from your parent branch
3. Build and start the application container
4. Connect the app to the ephemeral database

### 3. Access the Application

- **Application**: http://localhost:3000
- **Database**: `localhost:5432` (accessible via psql or any Postgres client)

### 4. Stop Development Environment

```bash
docker compose -f docker-compose.dev.yml down
```

When you stop the containers, the ephemeral branch is automatically deleted.

### Persisting Branches per Git Branch (Optional)

To keep database branches aligned with your Git branches, uncomment the volumes section in `docker-compose.dev.yml`:

```yaml
volumes:
  - ./.neon_local/:/tmp/.neon_local
  - ./.git/HEAD:/tmp/.git/HEAD:ro,consistent
```

And set `DELETE_BRANCH=false` in your environment file.

## Production Setup (Neon Cloud)

In production, the application connects directly to Neon Cloud without any local proxy.

### 1. Configure Environment

Copy and edit the production environment file:

```bash
cp .env.production .env.production.local
```

Fill in the required values in `.env.production.local`:

```bash
# Get from Neon Console → Project → Connection Details
NEON_URI=postgres://username:password@ep-your-endpoint.region.aws.neon.tech/dbname?sslmode=require

# Use strong, unique secrets in production!
JWT_SECRET=your_strong_production_jwt_secret
ARCJET_KEY=your_production_arcjet_key
```

### 2. Build and Start Production Environment

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production.local up --build -d
```

### 3. View Logs

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

### 4. Stop Production Environment

```bash
docker compose -f docker-compose.prod.yml down
```

## Database Migrations

### Development

Run migrations inside the development container:

```bash
docker compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Production

Option 1: Run migrations as part of deployment:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production.local run --rm app npm run db:migrate
```

Option 2: Run migrations directly (requires Node.js locally):

```bash
# Load production env and run migrations
export $(cat .env.production.local | xargs)
npm run db:migrate
```

## How DATABASE_URL Switching Works

The application uses the `NEON_URI` environment variable for database connections. The `NEON_LOCAL` flag determines how the connection is configured:

**Development (`NEON_LOCAL=true`):**
- Connection: `postgres://neon:npg@db:5432/neondb`
- Uses HTTP-based communication (required by Neon Local)
- `neonConfig.fetchEndpoint` is set to the local proxy

**Production (`NEON_LOCAL` not set):**
- Connection: Direct Neon Cloud URL from `NEON_URI`
- Uses standard Neon serverless driver configuration

This logic is handled in `src/config/db.js`.

## Useful Commands

```bash
# Build without starting
docker compose -f docker-compose.dev.yml build

# View running containers
docker compose -f docker-compose.dev.yml ps

# Shell into app container
docker compose -f docker-compose.dev.yml exec app sh

# View Neon Local logs
docker compose -f docker-compose.dev.yml logs db

# Rebuild specific service
docker compose -f docker-compose.dev.yml up --build app

# Remove all containers, networks, and volumes
docker compose -f docker-compose.dev.yml down -v
```

## Troubleshooting

### Neon Local container fails to start

1. Verify your `NEON_API_KEY` is valid
2. Check that `NEON_PROJECT_ID` and `PARENT_BRANCH_ID` are correct
3. View logs: `docker compose -f docker-compose.dev.yml logs db`

### App can't connect to database

1. Ensure the `db` service is healthy: `docker compose -f docker-compose.dev.yml ps`
2. Check that `DB_NAME` matches a database in your Neon project
3. Verify the app is waiting for db: check `depends_on` in compose file

### Database changes not persisting in development

This is expected behavior with ephemeral branches. To persist:
1. Set `DELETE_BRANCH=false` in your environment
2. Enable the volume mounts for branch persistence

### Docker Desktop on Mac - Branch detection issues

If using Docker Desktop for Mac with VirtioFS, switch to gRPC FUSE in VM settings. There's a known bug with VirtioFS that prevents proper branch detection.

## Security Notes

1. **Never commit `.env.*.local` files** - they contain secrets
2. **Use strong JWT secrets in production** - at least 32 characters
3. **Rotate API keys regularly** - especially for production
4. **Production deployments** - consider using secret management (Docker Secrets, Vault, etc.) instead of environment files
