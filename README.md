# Tasks API

This is a simple API for managing tasks. It allows you to create, read, update, and delete tasks. The API is built using NestJS and uses Postgres as the database.

## Development environment

### Prerequisites

- Node.js
- Docker
- Pnpm (optional, but recommended)

### Setup

1. Clone the repository
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Create a `.env` from `.env.template` and set the environment variables
4. Start the local database, be sure to have **Docker Desktop** running
   ```bash
   docker-compose up -d
   ```
5. Seeding the database with initial data (optional)
   ```bash
   pnpm db:seed
   ```
   This will create a user with the email `user@example.com` and password `123123`. And an admin user with the email `admin@example.com` and password `123123`. You can change the email and password in the `scripts/seed.ts` file.
5. Start the development server:
   ```bash
   pnpm start:dev
   ```
6. Access the API docs at `http://localhost:4000/api`
