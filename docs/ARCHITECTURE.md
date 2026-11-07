# Architecture Overview — Amit Chauhan Portfolio & Admin CMS

This document outlines the architecture, domain strategy, port assignments, and workspace setup for the unified monorepo.

---

## 1. Monorepo Structure

```text
/amit-portfolio
├── apps/
│   ├── web/               # Public portfolio client (amitchauhan.me)
│   ├── admin/             # Private admin CMS client (admin.amitchauhan.me)
│   └── api/               # Express.js REST API backend
├── packages/
│   └── shared/            # Shared interfaces, DTOs, schemas, and helper functions
├── docs/                  # Architecture and development workflows
├── docker-compose.yml     # PostgreSQL and database management containers
└── package.json           # Monorepo workspaces manifest
```

---

## 2. Domain & Routing Strategy

- **Public Production Web:** `https://amitchauhan.me` -> `apps/web`
- **Private Production Admin:** `https://admin.amitchauhan.me` -> `apps/admin`
- **API Backend:** `https://api.amitchauhan.me` (or `/api` reverse proxy) -> `apps/api`

---

## 3. Port Assignments (Development)

To avoid conflicts during parallel local execution:

| Service | Environment Port | Host / Protocol |
| :--- | :--- | :--- |
| **apps/web** | `3000` | `http://localhost:3000` |
| **apps/admin** | `3001` | `http://localhost:3001` |
| **apps/api** | `5000` | `http://localhost:5000` |
| **PostgreSQL** | `5432` | `localhost:5432` |
| **pgAdmin (Optional)** | `5050` | `http://localhost:5050` |

---

## 4. Design Direction

- **Public Client (`apps/web`):**
  - Modern dark developer aesthetic.
  - Deep slate backgrounds (`#090d16`), teal/cyan glowing highlights, subtle grid backdrops.
  - Motion powered by Framer Motion, iconography by Lucide React.
  - Fully responsive from mobile devices to ultrawide displays.

- **Admin CMS (`apps/admin`):**
  - Modern professional SaaS dashboard aesthetic.
  - Deep slate surfaces (`#0f172a`, `#1e293b`), crisp borders, indigo accents.
  - Clean sidebar navigation, data density, status metrics, and intuitive CRUD panels.

---

## 5. Shared Package Integration

`packages/shared` exports:
- Universal API response formats (`ApiResponse`, `PaginationParams`)
- Entity models (`User`, `Project`, `ContactMessage`)
- Data formatters (`formatDate`, `slugify`, `truncateText`)
- Validation helpers (`isValidEmail`, `isValidUrl`)

