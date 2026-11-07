# Production Dockerfile for Amit Chauhan REST API Backend
FROM node:20-bookworm-slim

WORKDIR /app

# Install openssl and build tools for native node addons (argon2, prisma)
RUN apt-get update -y && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy full monorepo
COPY . .

# Install dependencies across all workspaces
RUN npm ci

# Compile shared library, generate Prisma engine, and build API
RUN npm run build:shared
RUN npm run prisma:generate --workspace=@amit/api
RUN npm run build:api

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Execute safe database migrations and start production Express server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma && node apps/api/dist/index.js"]
