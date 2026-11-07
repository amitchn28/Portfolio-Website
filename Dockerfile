# Multi-stage Production Dockerfile for Amit Chauhan REST API Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install dependencies
RUN npm ci

# Build shared types, generate Prisma client, compile API
RUN npm run build:shared
RUN npm run prisma:generate --workspace=@amit/api
RUN npm run build:api

# Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# OpenSSL is required for Prisma client engine on Alpine
RUN apk add --no-cache openssl

# Copy package definitions
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled bundles and Prisma client
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy upload directory structure
COPY apps/api/uploads ./apps/api/uploads

EXPOSE 5000

# Run migrations and start API server
CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma && node apps/api/dist/index.js"]

