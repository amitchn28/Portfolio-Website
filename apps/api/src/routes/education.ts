import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  institution: z.string().min(1, 'Institution is required'),
  academicStatus: z.string().min(1, 'Academic status is required'),
  startYear: z.number().int().min(1980).max(2100),
  endYear: z.number().int().min(1980).max(2100).nullable().optional(),
  isCurrent: z.boolean().default(false),
  grade: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

// GET /api/education (Public)
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const list = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch education records', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/education (Admin Only)
router.post(
  '/',
  requireAuth,
  validate(educationSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const created = await prisma.education.create({
        data: req.body,
      });

      await prisma.auditLog.create({
        data: {
          userId: req.admin?.id,
          action: 'EDUCATION_CREATE',
          entity: 'Education',
          entityId: created.id,
          details: req.body,
        },
      });

      res.status(201).json({ success: true, message: 'Education record added', data: created });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to create education record', error: { code: 'CREATE_ERROR' } });
    }
  }
);

// PUT /api/education/:id (Admin Only)
router.put(
  '/:id',
  requireAuth,
  validate(educationSchema.partial()),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const id = req.params.id as string;
      const updated = await prisma.education.update({
        where: { id },
        data: req.body,
      });

      res.status(200).json({ success: true, message: 'Education record updated', data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update education record', error: { code: 'UPDATE_ERROR' } });
    }
  }
);

// DELETE /api/education/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.education.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Education record deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete education record', error: { code: 'DELETE_ERROR' } });
  }
});

export const educationRoutes = router;
