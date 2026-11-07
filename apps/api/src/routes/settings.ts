import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const websiteSettingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  siteTagline: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  isMaintenance: z.boolean().optional(),
  allowMessages: z.boolean().optional(),
  theme: z.string().optional(),
});

const seoSettingsSchema = z.object({
  metaTitle: z.string().min(1).optional(),
  metaDescription: z.string().min(1).optional(),
  metaKeywords: z.string().min(1).optional(),
  ogImage: z.string().nullable().optional(),
  twitterCard: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().optional(),
});

// GET /api/settings (Public)
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const [website, seo] = await Promise.all([
      prisma.websiteSettings.findFirst(),
      prisma.sEOSettings.findFirst(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        website: {
          siteName: website?.siteName || 'Amit Chauhan',
          siteTagline: website?.siteTagline || 'Personal Portfolio & CMS',
          contactEmail: website?.contactEmail || 'amitchn28@gmail.com',
          isMaintenance: website?.isMaintenance || false,
          theme: website?.theme || 'dark',
        },
        seo,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: { code: 'DB_ERROR' } });
  }
});

// GET /api/settings/admin (Admin Only)
router.get('/admin', requireAuth, async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const [website, seo] = await Promise.all([
      prisma.websiteSettings.findFirst(),
      prisma.sEOSettings.findFirst(),
    ]);

    res.status(200).json({
      success: true,
      data: { website, seo },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: { code: 'DB_ERROR' } });
  }
});

// PUT /api/settings/website (Admin Only)
router.put(
  '/website',
  requireAuth,
  validate(websiteSettingsSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const updated = await prisma.websiteSettings.upsert({
        where: { id: 'default' },
        update: req.body,
        create: { id: 'default', ...req.body },
      });

      res.status(200).json({ success: true, message: 'Website settings updated', data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update website settings', error: { code: 'UPDATE_ERROR' } });
    }
  }
);

// PUT /api/settings/seo (Admin Only)
router.put(
  '/seo',
  requireAuth,
  validate(seoSettingsSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const updated = await prisma.sEOSettings.upsert({
        where: { id: 'default' },
        update: req.body,
        create: { id: 'default', ...req.body },
      });

      res.status(200).json({ success: true, message: 'SEO settings updated', data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update SEO settings', error: { code: 'UPDATE_ERROR' } });
    }
  }
);

export const settingsRoutes = router;

