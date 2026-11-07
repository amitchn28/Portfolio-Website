import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { apiRoutes } from './routes';
import { seoRoutes } from './routes/seo';
import { errorHandler } from './middleware/errorHandler';
import { generalApiLimiter } from './middleware/rateLimit';
import { ApiResponse } from '@amit/shared';

const app: Application = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration supporting dynamic Vercel deployments, custom domains, and local dev
const parseOrigins = (raw?: string): string[] => {
  if (!raw) return [];
  return raw.split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);
};

const explicitOrigins = new Set([
  ...parseOrigins(env.CORS_ORIGIN_WEB),
  ...parseOrigins(env.CORS_ORIGIN_ADMIN),
  ...parseOrigins(process.env.ALLOWED_ORIGINS),
  'http://localhost:3000',
  'http://localhost:3001',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');

      // Match explicit configured origins
      if (explicitOrigins.has(normalizedOrigin)) {
        return callback(null, true);
      }

      // Automatically allow all Vercel deployments (*.vercel.app)
      if (normalizedOrigin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // In non-production, allow all localhost ports
      if (!env.IS_PROD && normalizedOrigin.startsWith('http://localhost:')) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// General request parsers
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan(env.IS_PROD ? 'combined' : 'dev'));

// Static files delivery for uploads (images, PDFs, documents)
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Rate limiting on API routes
app.use('/api', generalApiLimiter);

// Root informational endpoint
app.get('/', (_req: Request, res: Response<ApiResponse>) => {
  res.status(200).json({
    success: true,
    message: 'Amit Chauhan Portfolio & CMS REST API',
    data: {
      version: '1.0.0',
      status: 'operational',
      database: 'PostgreSQL 18 via Prisma ORM',
      endpoints: {
        health: '/api/health',
        profile: '/api/profile',
        about: '/api/about',
        skills: '/api/skills',
        projects: '/api/projects',
        education: '/api/education',
        experience: '/api/experience',
        certifications: '/api/certifications',
        achievements: '/api/achievements',
        resume: '/api/resume',
        socialLinks: '/api/social-links',
        contact: '/api/contact',
        settings: '/api/settings',
        analytics: '/api/analytics',
        auth: '/api/auth/login',
      },
    },
  });
});

// SEO Endpoints (Sitemap & Robots)
app.use('/', seoRoutes);

// Primary API Router
app.use('/api', apiRoutes);

// 404 Handler
app.use((_req: Request, res: Response<ApiResponse>) => {
  res.status(404).json({
    success: false,
    message: 'Requested route not found',
    error: { code: 'NOT_FOUND' },
  });
});

// Centralized error handling
app.use(errorHandler);

export { app };
