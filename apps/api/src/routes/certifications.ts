import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const certSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().transform((str) => new Date(str)),
  expiryDate: z.string().nullable().optional().transform((str) => (str ? new Date(str) : null)),
  credentialId: z.string().nullable().optional(),
  credentialUrl: z.string().url().nullable().optional().or(z.literal('')),
  certificateFileUrl: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

// GET /api/certifications (Public)
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
    });
    res.status(200).json({ success: true, data: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch certifications', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/certifications (Admin Only)
router.post('/', requireAuth, validate(certSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const created = await prisma.certification.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Certification created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create certification', error: { code: 'CREATE_ERROR' } });
  }
});

// PUT /api/certifications/:id (Admin Only)
router.put('/:id', requireAuth, validate(certSchema.partial()), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    const updated = await prisma.certification.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, message: 'Certification updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update certification', error: { code: 'UPDATE_ERROR' } });
  }
});

// DELETE /api/certifications/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.certification.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Certification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete certification', error: { code: 'DELETE_ERROR' } });
  }
});

export const certificationRoutes = router;
