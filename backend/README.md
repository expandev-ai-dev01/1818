# GradeBox Backend API

Backend API for GradeBox - Student Grade Management System

## Overview

GradeBox is a minimalist system for recording and querying student grades. It allows storing basic information such as student name, subject, and grade in the database, and then viewing these grades in a simple and fast way.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Microsoft SQL Server
- **Validation**: Zod

## Project Structure

```
backend/
├── migrations/              # SQL migration files
├── src/
│   ├── api/                # API controllers
│   │   └── v1/            # API version 1
│   │       ├── external/  # Public endpoints
│   │       └── internal/  # Authenticated endpoints
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── migrations/        # Migration runner code
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── server.ts          # Application entry point
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Microsoft SQL Server instance
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database credentials:
   ```
   DB_SERVER=your_server
   DB_NAME=gradebox
   DB_USER=your_user
   DB_PASSWORD=your_password
   PROJECT_ID=gradebox
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm start
```

#### Run Migrations Manually
```bash
npm run migrate
```

## API Endpoints

The API is versioned and follows RESTful conventions:

- Base URL: `http://localhost:3000/api/v1`
- Health Check: `http://localhost:3000/health`

### External Endpoints (Public)
- `/api/v1/external/*` - Public endpoints

### Internal Endpoints (Authenticated)
- `/api/v1/internal/*` - Authenticated endpoints

## Database Migrations

The application uses an automated migration system that:

- Runs automatically on application startup
- Uses schema isolation for multi-tenancy
- Tracks executed migrations with checksums
- Supports idempotent migrations

### Migration Files

Place SQL migration files in the `migrations/` directory. The system will:

1. Create the project schema (`project_gradebox`)
2. Execute pending migrations in order
3. Track execution history
4. Skip already-executed migrations

## Environment Variables

### Required
- `DB_SERVER` - Database server address
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `PROJECT_ID` - Project identifier for schema isolation

### Optional
- `NODE_ENV` - Environment (development/production)
- `PORT` - API port (default: 3000)
- `DB_PORT` - Database port (default: 1433)
- `DB_ENCRYPT` - Enable encryption (default: true)
- `API_VERSION` - API version (default: v1)
- `CORS_ORIGINS` - Allowed CORS origins (production)

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use 2-space indentation
- Maximum line length: 120 characters

### API Development
- Place controllers in `src/api/v1/internal/` or `src/api/v1/external/`
- Implement business logic in `src/services/`
- Use Zod for request validation
- Follow CRUD controller patterns

### Database Development
- Always use `[dbo]` schema in SQL files
- Migration runner converts to `[project_gradebox]` at runtime
- Use stored procedures for all database operations
- Follow naming conventions: `spEntityOperation`

## Testing

Test files should be colocated with source files:
- Unit tests: `*.test.ts`
- Integration tests: `*Integration.ts`

## License

ISC

## Support

For issues and questions, please refer to the project documentation.