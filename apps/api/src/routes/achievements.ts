import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  organization: z.string().nullable().optional(),
  date: z.string().transform((str) => new Date(str)),
  description: z.string().min(1, 'Description is required'),
  badgeUrl: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

// GET /api/achievements (Public)
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const list = await prisma.achievement.findMany({
      orderBy: [{ order: 'asc' }, { date: 'desc' }],
    });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch achievements', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/achievements (Admin Only)
router.post('/', requireAuth, validate(achievementSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const created = await prisma.achievement.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Achievement created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create achievement', error: { code: 'CREATE_ERROR' } });
  }
});

// PUT /api/achievements/:id (Admin Only)
router.put('/:id', requireAuth, validate(achievementSchema.partial()), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    const updated = await prisma.achievement.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, message: 'Achievement updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update achievement', error: { code: 'UPDATE_ERROR' } });
  }
});

// DELETE /api/achievements/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.achievement.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete achievement', error: { code: 'DELETE_ERROR' } });
  }
});

export const achievementRoutes = router;
