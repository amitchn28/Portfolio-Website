import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const resumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  version: z.string().min(1, 'Version is required'),
  fileUrl: z.string().min(1, 'File URL is required'),
  fileSize: z.number().int().optional(),
  isPrimary: z.boolean().default(true),
});

// GET /api/resume (Public) - returns primary resume
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { isPrimary: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!resume) {
      res.status(404).json({ success: false, message: 'No primary resume currently published' });
      return;
    }

    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume', error: { code: 'DB_ERROR' } });
  }
});

// GET /api/resume/all (Admin Only)
router.get('/all', requireAuth, async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch resumes', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/resume (Admin Only)
router.post('/', requireAuth, validate(resumeSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { isPrimary, ...data } = req.body;

    if (isPrimary) {
      // Set all other resumes to not primary
      await prisma.resume.updateMany({
        where: { isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const created = await prisma.resume.create({
      data: { ...data, isPrimary },
    });

    res.status(201).json({ success: true, message: 'Resume uploaded', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save resume record', error: { code: 'CREATE_ERROR' } });
  }
});

// DELETE /api/resume/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.resume.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete resume', error: { code: 'DELETE_ERROR' } });
  }
});

export const resumeRoutes = router;
