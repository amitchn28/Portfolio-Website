import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { slugify } from '@amit/shared';
import { ApiResponse } from '@amit/shared';

const router = Router();

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  proficiency: z.number().int().min(1).max(100).default(80),
  icon: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  order: z.number().int().default(0),
});

// GET /api/skills (Public) - with optional ?featured=true
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const featuredOnly = req.query.featured === 'true';

    const categoriesWithSkills = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          where: featuredOnly ? { featured: true } : undefined,
          orderBy: { order: 'asc' },
        },
      },
    });

    res.status(200).json({ success: true, data: categoriesWithSkills });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch skills', error: { code: 'DB_ERROR' } });
  }
});

// GET /api/skills/categories (Public)
router.get('/categories', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch skill categories', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/skills (Admin Only)
router.post('/', requireAuth, validate(skillSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { name, categoryId, proficiency, icon, featured, order } = req.body;
    const slug = slugify(name);

    const created = await prisma.skill.create({
      data: {
        name,
        slug,
        categoryId,
        proficiency,
        icon,
        featured,
        order,
      },
    });

    res.status(201).json({ success: true, message: 'Skill created successfully', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create skill', error: { code: 'CREATE_ERROR' } });
  }
});

// PUT /api/skills/:id (Admin Only)
router.put('/:id', requireAuth, validate(skillSchema.partial()), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    const data = { ...req.body };
    if (data.name) {
      data.slug = slugify(data.name);
    }

    const updated = await prisma.skill.update({
      where: { id },
      data,
    });

    res.status(200).json({ success: true, message: 'Skill updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update skill', error: { code: 'UPDATE_ERROR' } });
  }
});

// DELETE /api/skills/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.skill.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete skill', error: { code: 'DELETE_ERROR' } });
  }
});

// POST /api/skills/categories (Admin Only)
router.post('/categories', requireAuth, validate(categorySchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { name, order } = req.body;
    const slug = slugify(name);

    const created = await prisma.skillCategory.create({
      data: { name, slug, order },
    });

    res.status(201).json({ success: true, message: 'Category created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: { code: 'CREATE_ERROR' } });
  }
});

export const skillsRoutes = router;
