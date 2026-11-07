import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { slugify } from '@amit/shared';
import { ApiResponse } from '@amit/shared';

const router = Router();

const projectCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().nullable().optional(),
  category: z.string().default('FULL_STACK'),
  status: z.string().default('COMPLETED'),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
  liveUrl: z.string().url().nullable().optional().or(z.literal('')),
  githubUrl: z.string().url().nullable().optional().or(z.literal('')),
  demoVideoUrl: z.string().url().nullable().optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
        isThumbnail: z.boolean().default(false),
        order: z.number().int().default(0),
      })
    )
    .optional(),
});

// GET /api/projects (Public) - with search, filter, pagination
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;

    const { category, status, featured, q } = req.query;

    const where: Record<string, unknown> = {};

    // By default, public endpoint only returns published projects unless admin query
    if (req.query.includeUnpublished !== 'true') {
      where.published = true;
    }

    if (category) where.category = category;
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured === 'true';

    if (q) {
      where.OR = [
        { title: { contains: String(q), mode: 'insensitive' } },
        { subtitle: { contains: String(q), mode: 'insensitive' } },
        { description: { contains: String(q), mode: 'insensitive' } },
      ];
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
        include: {
          technologies: true,
          images: { orderBy: { order: 'asc' } },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: projects,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects', error: { code: 'DB_ERROR' } });
  }
});

// GET /api/projects/:slug (Public)
router.get('/:slug', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const slug = req.params.slug as string;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: true,
        images: { orderBy: { order: 'asc' } },
      },
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve project', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/projects (Admin Only)
router.post(
  '/',
  requireAuth,
  validate(projectCreateSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const { technologies = [], images = [], ...projectData } = req.body;
      const baseSlug = slugify(projectData.title);
      let slug = baseSlug;

      // Ensure unique slug
      const existing = await prisma.project.findUnique({ where: { slug } });
      if (existing) {
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }

      const created = await prisma.project.create({
        data: {
          ...projectData,
          slug,
          technologies: {
            create: technologies.map((techName: string) => ({
              name: techName,
            })),
          },
          images: {
            create: images,
          },
        },
        include: {
          technologies: true,
          images: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.admin?.id,
          action: 'PROJECT_CREATE',
          entity: 'Project',
          entityId: created.id,
          details: { title: created.title, slug: created.slug },
        },
      });

      res.status(201).json({ success: true, message: 'Project created successfully', data: created });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: { code: 'CREATE_ERROR', details: (err as Error).message },
      });
    }
  }
);

// PUT /api/projects/:id (Admin Only)
router.put(
  '/:id',
  requireAuth,
  validate(projectCreateSchema.partial()),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const id = req.params.id as string;
      const { technologies, images, ...updateData } = req.body;

      if (updateData.title && !updateData.slug) {
        updateData.slug = slugify(updateData.title);
      }

      // If technologies provided, replace them
      if (technologies) {
        await prisma.projectTechnology.deleteMany({ where: { projectId: id } });
        await prisma.projectTechnology.createMany({
          data: technologies.map((techName: string) => ({
            projectId: id,
            name: techName,
          })),
        });
      }

      // If images provided, replace them
      if (images) {
        await prisma.projectImage.deleteMany({ where: { projectId: id } });
        await prisma.projectImage.createMany({
          data: images.map((img: { url: string; alt?: string; caption?: string; isThumbnail?: boolean; order?: number }) => ({
            projectId: id,
            ...img,
          })),
        });
      }

      const updated = await prisma.project.update({
        where: { id },
        data: updateData,
        include: {
          technologies: true,
          images: true,
        },
      });

      res.status(200).json({ success: true, message: 'Project updated successfully', data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update project', error: { code: 'UPDATE_ERROR' } });
    }
  }
);

// DELETE /api/projects/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.project.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete project', error: { code: 'DELETE_ERROR' } });
  }
});

export const projectRoutes = router;
