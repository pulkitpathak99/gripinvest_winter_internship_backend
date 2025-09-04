# Grip Invest - Mini Investment Platform

This repository contains the full-stack project for the Grip Invest Winter Internship 2025.

## Project Structure

This project is a monorepo managed with `pnpm` workspaces.
- `/backend`: Node.js, Express, Prisma, and MySQL backend server.
- `/frontend`: Next.js and TailwindCSS frontend application.

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm ( `npm install -g pnpm` )
- Docker and Docker Compose (for running the database)

### Setup
1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd gripinvest_winter_internship_backend
   ```

2. Install dependencies for all workspaces:
   ```bash
   pnpm install
   ```

3. Set up the environment variables for the backend:
   * Copy `.env.example` to `.env` in the `/backend` directory.
   * Fill in your `DATABASE_URL` and `JWT_SECRET`.
   ```bash
   cp backend/.env.example backend/.env
   ```

4. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   pnpm dev
   ```

The backend server will be available at `http://localhost:3001`.

---

We will add the testing part in a subsequent step to keep this focused. For now, you have a solid foundation.