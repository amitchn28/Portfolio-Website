import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  employmentType: z.string().default('FULL_TIME'),
  location: z.string().nullable().optional(),
  locationType: z.string().default('REMOTE'),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().nullable().optional().transform((str) => (str ? new Date(str) : null)),
  isCurrent: z.boolean().default(false),
  description: z.string().min(1, 'Description is required'),
  achievements: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

// GET /api/experience (Public)
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const list = await prisma.experience.findMany({
      orderBy: [{ isCurrent: 'desc' }, { order: 'asc' }, { startDate: 'desc' }],
    });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch experience records', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/experience (Admin Only)
router.post('/', requireAuth, validate(experienceSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const created = await prisma.experience.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Experience record created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create experience', error: { code: 'CREATE_ERROR' } });
  }
});

// PUT /api/experience/:id (Admin Only)
router.put('/:id', requireAuth, validate(experienceSchema.partial()), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    const updated = await prisma.experience.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, message: 'Experience updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update experience', error: { code: 'UPDATE_ERROR' } });
  }
});

// DELETE /api/experience/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.experience.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete experience', error: { code: 'DELETE_ERROR' } });
  }
});

export const experienceRoutes = router;
