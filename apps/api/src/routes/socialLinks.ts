import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL'),
  username: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// GET /api/social-links (Public)
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const links = await prisma.socialLink.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { order: 'asc' },
    });
    res.status(200).json({ success: true, data: links });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch social links', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/social-links (Admin Only)
router.post('/', requireAuth, validate(socialLinkSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const created = await prisma.socialLink.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Social link created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create social link', error: { code: 'CREATE_ERROR' } });
  }
});

// PUT /api/social-links/:id (Admin Only)
router.put('/:id', requireAuth, validate(socialLinkSchema.partial()), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    const updated = await prisma.socialLink.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, message: 'Social link updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update social link', error: { code: 'UPDATE_ERROR' } });
  }
});

// DELETE /api/social-links/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.socialLink.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Social link deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete social link', error: { code: 'DELETE_ERROR' } });
  }
});

export const socialLinksRoutes = router;
