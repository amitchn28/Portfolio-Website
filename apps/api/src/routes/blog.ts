import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { slugify } from '@amit/shared';
import { ApiResponse } from '@amit/shared';

const router = Router();

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  summary: z.string().min(1, 'Summary is required'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.string().nullable().optional().transform((s) => (s ? new Date(s) : null)),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});

// GET /api/blog (Public & Admin)
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const skip = (page - 1) * limit;
    const includeUnpublished = req.query.includeUnpublished === 'true';

    const where: Record<string, unknown> = {};
    if (!includeUnpublished) {
      where.published = true;
    }

    if (req.query.tag) {
      where.tags = { has: String(req.query.tag) };
    }

    if (req.query.q) {
      where.OR = [
        { title: { contains: String(req.query.q), mode: 'insensitive' } },
        { summary: { contains: String(req.query.q), mode: 'insensitive' } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: { code: 'DB_ERROR', details: (err as Error).message },
    });
  }
});

// GET /api/blog/:slug (Public)
router.get('/:slug', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const slug = req.params.slug as string;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    // If unpublished, require admin authentication
    if (!post.published) {
      const authHeader = req.headers.authorization;
      const cookieToken = req.cookies?.admin_token;
      if (!authHeader && !cookieToken) {
        res.status(404).json({ success: false, message: 'Article not found' });
        return;
      }
    }

    // Increment view count if public read
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve article', error: { code: 'DB_ERROR' } });
  }
});

// POST /api/blog (Admin Only)
router.post(
  '/',
  requireAuth,
  validate(blogSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const { title, summary, content, featuredImage, tags, published, seoTitle, seoDescription } = req.body;
      const baseSlug = slugify(title);
      let slug = req.body.slug ? slugify(req.body.slug) : baseSlug;

      // Ensure unique slug
      const existing = await prisma.blogPost.findUnique({ where: { slug } });
      if (existing) {
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }

      const publishedAt = published ? new Date() : null;

      const created = await prisma.blogPost.create({
        data: {
          title,
          slug,
          summary,
          content,
          featuredImage: featuredImage || null,
          tags: tags || [],
          published: Boolean(published),
          publishedAt,
          seoTitle: seoTitle || title,
          seoDescription: seoDescription || summary,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.admin?.id,
          action: 'BLOG_CREATE',
          entity: 'BlogPost',
          entityId: created.id,
          details: { title: created.title, slug: created.slug },
        },
      });

      res.status(201).json({ success: true, message: 'Article created successfully', data: created });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to create article',
        error: { code: 'CREATE_ERROR', details: (err as Error).message },
      });
    }
  }
);

// PUT /api/blog/:id (Admin Only)
router.put(
  '/:id',
  requireAuth,
  validate(blogSchema.partial()),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const id = req.params.id as string;
      const existing = await prisma.blogPost.findUnique({ where: { id } });

      if (!existing) {
        res.status(404).json({ success: false, message: 'Article not found' });
        return;
      }

      const updateData = { ...req.body };

      // If publishing for the first time, set publishedAt
      if (updateData.published === true && !existing.published && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }

      if (updateData.title && !updateData.slug) {
        updateData.slug = slugify(updateData.title);
      }

      const updated = await prisma.blogPost.update({
        where: { id },
        data: updateData,
      });

      await prisma.auditLog.create({
        data: {
          userId: req.admin?.id,
          action: 'BLOG_UPDATE',
          entity: 'BlogPost',
          entityId: updated.id,
          details: { title: updated.title, published: updated.published },
        },
      });

      res.status(200).json({ success: true, message: 'Article updated successfully', data: updated });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to update article',
        error: { code: 'UPDATE_ERROR', details: (err as Error).message },
      });
    }
  }
);

// DELETE /api/blog/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.blogPost.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.admin?.id,
        action: 'BLOG_DELETE',
        entity: 'BlogPost',
        entityId: id,
      },
    });

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete article',
      error: { code: 'DELETE_ERROR', details: (err as Error).message },
    });
  }
});

export const blogRoutes = router;

