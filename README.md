# ACQUISITIONS

A modern, secure REST API built with Express.js and Neon Serverless PostgreSQL. Features JWT authentication, role-based access control, and production-ready Docker deployment.

## Features

- **Authentication** – JWT-based auth with secure HTTP-only cookies
- **Authorization** – Role-based access control (user/admin)
- **Database** – Neon Serverless PostgreSQL with Drizzle ORM
- **Security** – Arcjet protection (rate limiting, bot detection, shield)
- **Validation** – Request validation with Zod schemas
- **Logging** – Structured logging with Winston
- **Docker** – Multi-stage builds for dev and production
- **CI/CD** – GitHub Actions for linting, testing, and deployment

## Tech Stack

| Category   | Technology                 |
| ---------- | -------------------------- |
| Runtime    | Node.js 22                 |
| Framework  | Express.js 5               |
| Database   | Neon Serverless PostgreSQL |
| ORM        | Drizzle ORM                |
| Auth       | JWT + bcrypt               |
| Validation | Zod                        |
| Security   | Helmet, CORS, Arcjet       |
| Logging    | Winston + Morgan           |
| Testing    | Jest + Supertest           |
| Linting    | ESLint + Prettier          |
| Container  | Docker + Docker Compose    |

## Project Structure

```
├── .github/workflows/      # CI/CD pipelines
│   ├── lint-and-format.yml
│   ├── tests.yml
│   └── docker-build-and-push.yml
├── drizzle/                # Database migrations
├── src/
│   ├── config/             # Configuration (db, logger, arcjet)
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & security middleware
│   ├── models/             # Drizzle schema definitions
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   ├── utils/              # Helper utilities
│   ├── validations/        # Zod validation schemas
│   ├── tests/              # Test files
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── index.js            # Main entry point
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.dev.yml  # Development with Neon Local
├── docker-compose.prod.yml # Production deployment
└── package.json
```

## Prerequisites

- Node.js 20+ (22 recommended)
- npm 10+
- Docker & Docker Compose (for containerized development)
- [Neon](https://neon.tech) account (for cloud database)
- [Arcjet](https://arcjet.com) account (for security features)

## Installation

```bash
# Clone the repository
git clone https://github.com/IamAshishSingh02/ACQUISITIONS.git
cd ACQUISITIONS

# Install dependencies
npm ci
```

## Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env.development
```

### Required Variables

| Variable         | Description                                         |
| ---------------- | --------------------------------------------------- |
| `PORT`           | Server port (default: 3000)                         |
| `NODE_ENV`       | Environment (`development` / `production` / `test`) |
| `NEON_URI`       | Neon PostgreSQL connection string                   |
| `JWT_SECRET`     | Secret key for JWT signing                          |
| `JWT_EXPIRES_IN` | Token expiration (e.g., `1d`, `7d`)                 |
| `ARCJET_KEY`     | Arcjet API key for security features                |

### Neon Local Development (Optional)

For local development with ephemeral database branches:

| Variable           | Description                             |
| ------------------ | --------------------------------------- |
| `NEON_LOCAL`       | Set to `true` to enable local proxy     |
| `NEON_API_KEY`     | Neon API key                            |
| `NEON_PROJECT_ID`  | Neon project ID                         |
| `PARENT_BRANCH_ID` | Parent branch ID for ephemeral branches |

## Running the Application

### Local Development (without Docker)

```bash
# Start development server with hot reload
npm run dev

# Or start production server
npm start
```

### Docker Development (with Neon Local)

```bash
# Start development environment
npm run dev:docker
# or
docker compose -f docker-compose.dev.yml up --build

# Stop environment
docker compose -f docker-compose.dev.yml down
```

### Docker Production

```bash
# Start production environment
npm run prod:docker
# or
docker compose -f docker-compose.prod.yml up --build -d
```

## Database Migrations

Using Drizzle Kit for database migrations:

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## API Endpoints

### Health & Status

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| GET    | `/`       | Welcome message          |
| GET    | `/health` | Health check with uptime |
| GET    | `/api`    | API status               |

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/sign-up`  | Register new user |
| POST   | `/api/auth/sign-in`  | Login user        |
| POST   | `/api/auth/sign-out` | Logout user       |

### Users (Protected)

| Method | Endpoint         | Auth       | Description    |
| ------ | ---------------- | ---------- | -------------- |
| GET    | `/api/users`     | Admin      | List all users |
| GET    | `/api/users/:id` | Self/Admin | Get user by ID |
| PUT    | `/api/users/:id` | Self/Admin | Update user    |
| DELETE | `/api/users/:id` | Admin      | Delete user    |

### Request/Response Examples

**Sign Up**

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "SecurePass123!"}'
```

**Sign In**

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "john@example.com", "password": "SecurePass123!"}'
```

**Get User (Authenticated)**

```bash
curl http://localhost:3000/api/users/1 \
  -b cookies.txt
```

## Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm test -- --watch
```

Coverage reports are generated in the `coverage/` directory.

## Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting
npm run format
```

## CI/CD Pipelines

GitHub Actions workflows are configured for:

- **Lint and Format** – Runs on PRs/pushes to `main`/`staging`
- **Tests** – Runs test suite with coverage reporting
- **Docker Build** – Builds and pushes multi-platform images to Docker Hub

### Required GitHub Secrets

| Secret            | Description                     |
| ----------------- | ------------------------------- |
| `DATABASE_URL`    | Test database connection string |
| `DOCKER_USERNAME` | Docker Hub username             |
| `DOCKER_PASSWORD` | Docker Hub password/token       |

## Security Features

- **Helmet** – Sets security HTTP headers
- **CORS** – Cross-origin resource sharing protection
- **Arcjet Shield** – Protection against common attacks
- **Bot Detection** – Blocks malicious bots (allows search engines)
- **Rate Limiting** – Sliding window (5 requests/2 seconds)
- **JWT in HTTP-only Cookies** – Prevents XSS token theft
- **Password Hashing** – bcrypt with salt rounds

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
