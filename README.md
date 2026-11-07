# Amit Chauhan — Full-Stack Developer Portfolio & CMS Monorepo

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-black?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.3-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A high-performance personal developer portfolio and private administration content management system (CMS) built in an npm workspaces monorepo architecture.

---

## 🏛️ Architecture Overview

```text
/amit-portfolio
├── apps/
│   ├── web/               # Public Portfolio Frontend (React 18, Vite, Tailwind CSS, Framer Motion)
│   ├── admin/             # Private Admin CMS Dashboard (React 18, Vite, Tailwind CSS, 18 Modules)
│   └── api/               # Express.js REST API Backend (TypeScript, Prisma ORM, Argon2id, Helmet)
├── packages/
│   └── shared/            # Shared TypeScript types, schemas, and utility functions
├── Dockerfile             # Multi-stage production container build
├── docker-compose.yml     # PostgreSQL 16 & pgAdmin development services
└── package.json           # Root npm workspaces configuration
```

---

## ✨ Key Features

- **⚡ High-Performance Public Portfolio:** Hardware-accelerated 60fps animations with Framer Motion, dynamic wave ribbon background canvas, custom tactical HUD reticle cursor, and mobile-responsive layout.
- **🛠️ 18-Module Private Admin CMS:** Full CRUD control over projects, skills taxonomy, academic history, professional experience, certifications, blog articles, resume downloads, and visitor messages.
- **🎨 Dynamic Theme Engine:** 6 developer themes (including *Mumbai Twilight*, *Cyber Midnight*, *Sunset Blaze*) stored in PostgreSQL and synced to public visitors.
- **🔒 Enterprise Security:** Argon2id password hashing, stateful JWT session management, HTTP-only cross-origin cookies, Helmet protection, Zod request validation, and rate limiting.
- **🖼️ Built-in Image Cropper & Adjuster:** Client-side modal supporting drag-and-pan framing, 1x–3.5x zoom, 90° rotation, and 512×512 WebP compression.
- **🚀 Cloud Deployment Ready:** Pre-configured Vercel SPA client-side routing rewrites (`vercel.json`), multi-stage production `Dockerfile`, and Prisma migration pipelines for managed PostgreSQL (Neon / Supabase / Railway).

---

## 🛠️ Tech Stack

| Workspace | Technologies |
| :--- | :--- |
| **Public Portfolio (`apps/web`)** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Admin Dashboard (`apps/admin`)** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend REST API (`apps/api`)** | Node.js, Express.js, TypeScript, Prisma ORM, Argon2id, Zod, Helmet, Morgan |
| **Shared Package (`packages/shared`)** | Universal TypeScript types, API contracts, formatting and validation utilities |
| **Database** | PostgreSQL 16+ via Prisma ORM |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: Local instance, Docker container, or cloud database (Neon / Supabase)

### 1. Installation

Clone the repository and install all dependencies across the monorepo:

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment configurations:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```

Update `DATABASE_URL` in `apps/api/.env` with your PostgreSQL credentials.

### 3. Database Initialization

Run Prisma migrations to deploy database schema and seed initial data:

```bash
# Apply database migrations
npm run prisma:deploy --workspace=@amit/api

# Seed default portfolio content & admin account
npm run prisma:seed --workspace=@amit/api
```

### 4. Running the Development Servers

Start all three applications concurrently:

```bash
npm run dev
```

Or run individual applications:

```bash
npm run dev:api     # Backend REST API (Port 5000)
npm run dev:web     # Public Portfolio (Port 3000)
npm run dev:admin   # Admin Dashboard (Port 3001)
```

---

## 🧪 Testing & Verification

Run the automated backend integration test suite:

```bash
npm run test --workspace=@amit/api
```

Build all packages for production:

```bash
npm run build
```

---

## 📜 Monorepo Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts API, Web, and Admin concurrently using `concurrently` |
| `npm run build` | Compiles all packages (`shared`, `api`, `web`, `admin`) |
| `npm run build:shared` | Compiles shared TypeScript library |
| `npm run build:api` | Compiles Express backend TypeScript to `dist/` |
| `npm run build:web` | Builds optimized production bundle for public portfolio |
| `npm run build:admin` | Builds optimized production bundle for admin dashboard |
| `npm run clean` | Removes all `node_modules` and `dist` build folders |

---

## 👤 Author

**Amit Chauhan**
- GitHub: [@amitchn28](https://github.com/amitchn28)
- LinkedIn: [Amit Chauhan](https://www.linkedin.com/in/amit-chauhan-613833329)

---

## 📄 License

This project is licensed under the MIT License.
