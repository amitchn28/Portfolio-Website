import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ApiResponse } from '@amit/shared';

const router = Router();

const analyticsEventSchema = z.object({
  eventType: z.string().min(1),
  path: z.string().min(1),
  referrer: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// POST /api/analytics (Public Event Logger)
router.post('/', validate(analyticsEventSchema), async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { eventType, path, referrer, metadata } = req.body;

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        path,
        referrer: referrer || null,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || null,
        metadata: metadata ? (metadata as Record<string, unknown> as any) : undefined,
      },
    });

    res.status(201).json({ success: true, message: 'Event logged', data: { id: event.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record analytics event', error: { code: 'LOG_ERROR' } });
  }
});

// GET /api/analytics/overview (Admin Only)
router.get('/overview', requireAuth, async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const [totalEvents, totalPageViews, totalProjectViews, totalResumeDownloads, recentEvents, recentAuditLogs] =
      await Promise.all([
        prisma.analyticsEvent.count(),
        prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
        prisma.analyticsEvent.count({ where: { eventType: 'PROJECT_VIEW' } }),
        prisma.analyticsEvent.count({ where: { eventType: 'RESUME_DOWNLOAD' } }),
        prisma.analyticsEvent.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.auditLog.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true, email: true } },
          },
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalEvents,
          totalPageViews,
          totalProjectViews,
          totalResumeDownloads,
        },
        recentEvents,
        recentAuditLogs,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics overview', error: { code: 'DB_ERROR' } });
  }
});

// GET /api/analytics/dashboard (Admin Dashboard Overview)
router.get('/dashboard', requireAuth, async (_req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      unreadMessages,
      totalMessages,
      totalSkills,
      totalArticles,
      pageViews,
      resumeDownloads,
      recentMessages,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.contactMessage.count(),
      prisma.skill.count(),
      prisma.blogPost.count(),
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'RESUME_DOWNLOAD' } }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProjects,
          publishedProjects,
          unreadMessages,
          totalMessages,
          totalSkills,
          totalArticles,
          totalVisitors: pageViews, // accurately reflects recorded page view events
          resumeDownloads,
        },
        recentMessages,
        recentAuditLogs,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard metrics',
      error: { code: 'DB_ERROR', details: (err as Error).message },
    });
  }
});

export const analyticsRoutes = router;

