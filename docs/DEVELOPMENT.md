# Development Guide — Amit Chauhan Portfolio & Admin CMS

## 1. Prerequisites

- **Node.js**: v18.0.0+ (Tested with v26.8.1)
- **npm**: v9.0.0+ (Tested with v11.19.0)
- **Docker** (Optional, recommended for PostgreSQL) or local/cloud PostgreSQL

---

## 2. Installation

Run in the root directory:

```bash
npm install
```

This installs dependencies across all workspaces (`apps/web`, `apps/admin`, `apps/api`, and `packages/shared`).

---

## 3. Database Options

### Option A: Docker (Default)
When Docker Desktop is installed and running:
```bash
docker compose up -d postgres
```

### Option B: Local PostgreSQL (Windows / Linux / macOS)
If Docker is unavailable:
1. Install PostgreSQL natively (e.g. from postgresql.org).
2. Create database `amit_portfolio`.
3. Set your connection URL in `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/amit_portfolio?schema=public"
   ```

### Option C: Managed Cloud PostgreSQL (Neon / Supabase / Railway)
1. Create a free PostgreSQL instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the pooled or direct connection string into `.env` and `apps/api/.env`.

---

## 4. Running Development Servers

### All services concurrently:
```bash
npm run dev
```

### Individual services:
```bash
npm run dev:api     # Backend API on port 5000
npm run dev:web     # Public Portfolio on port 3000
npm run dev:admin   # Admin Dashboard on port 3001
```

---

## 5. Building for Production

Build all packages and applications:
```bash
npm run build
```
Build outputs will appear in:
- `apps/web/dist`
- `apps/admin/dist`
- `apps/api/dist`

