# Tasks API

This is a simple API for managing tasks. It allows you to create, read, update, and delete tasks. The API is built using NestJS and uses Postgres as the database.

## Development environment

### Prerequisites

- Node.js
- Docker

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
5. Start the development server:
   ```bash
   pnpm start:dev
   ```
