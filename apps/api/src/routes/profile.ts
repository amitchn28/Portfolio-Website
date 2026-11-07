import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  tagline: z.string().optional(),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  resumeUrl: z.string().nullable().optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().nullable().optional(),
  availability: z.string().optional(),
  currentStatus: z.string().optional(),
  yearsOfExperience: z.union([z.number(), z.string().transform((v) => parseInt(v) || 0)]).optional(),
});

// GET /api/profile (Public)
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving profile', error: { code: 'DB_ERROR' } });
  }
});

// PUT /api/profile (Admin Only)
router.put(
  '/',
  requireAuth,
  validate(updateProfileSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const updated = await prisma.profile.upsert({
        where: { id: 'default' },
        update: req.body,
        create: {
          id: 'default',
          name: req.body.name || 'Amit Chauhan',
          headline: req.body.headline || 'Full-Stack & AI Engineer',
          tagline: req.body.tagline || 'Building Resilient Systems',
          shortBio: req.body.shortBio || 'CS Student & Software Developer',
          fullBio: req.body.fullBio || 'Passionate software engineer',
          location: req.body.location || 'Mumbai, India',
          email: req.body.email || 'amitchn28@gmail.com',
          currentStatus: req.body.currentStatus || 'Fourth year',
          ...req.body,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.admin?.id,
          action: 'PROFILE_UPDATE',
          entity: 'Profile',
          entityId: 'default',
          details: req.body,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update profile', error: { code: 'UPDATE_ERROR' } });
    }
  }
);

export const profileRoutes = router;

