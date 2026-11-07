import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { contactLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { emailService } from '../services/email';
import { ApiResponse } from '@amit/shared';

const router = Router();

const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

const statusUpdateSchema = z.object({
  status: z.enum(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']),
});

// POST /api/contact (Public, Rate-Limited)
router.post(
  '/',
  contactLimiter,
  validate(contactMessageSchema),
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      // Check if messages are allowed in settings
      const settings = await prisma.websiteSettings.findFirst();
      if (settings && !settings.allowMessages) {
        res.status(403).json({
          success: false,
          message: 'Contact messages are currently paused by the administrator.',
          error: { code: 'MESSAGES_PAUSED' },
        });
        return;
      }

      const { name, email, subject, message } = req.body;

      // Duplicate submission protection (within last 60 seconds)
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const existingDuplicate = await prisma.contactMessage.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          message: message.trim(),
          createdAt: { gte: oneMinuteAgo },
        },
      });

      if (existingDuplicate) {
        res.status(200).json({
          success: true,
          message: 'Your message was already received. Thank you!',
          data: { id: existingDuplicate.id, createdAt: existingDuplicate.createdAt },
        });
        return;
      }

      const created = await prisma.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          subject: subject ? subject.trim() : null,
          message: message.trim(),
          status: 'UNREAD',
          ipAddress: req.ip || null,
        },
      });

      // Async email notification (non-blocking)
      emailService.sendContactNotification({ name, email, subject, message }).catch((err) => {
        console.error('⚠️ [Contact] Notification email failed:', err);
      });

      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully. Thank you!',
        data: { id: created.id, createdAt: created.createdAt },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to process message',
        error: { code: 'CONTACT_ERROR', details: (err as Error).message },
      });
    }
  }
);

// GET /api/contact (Admin Only)
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [total, messages, unreadCount] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        messages,
        unreadCount,
      },
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: { code: 'DB_ERROR' } });
  }
});

// PATCH /api/contact/:id/status (Admin Only)
router.patch(
  '/:id/status',
  requireAuth,
  validate(statusUpdateSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      const updated = await prisma.contactMessage.update({
        where: { id },
        data: { status },
      });

      res.status(200).json({ success: true, message: 'Status updated', data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update message status', error: { code: 'UPDATE_ERROR' } });
    }
  }
);

// DELETE /api/contact/:id (Admin Only)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    await prisma.contactMessage.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete message', error: { code: 'DELETE_ERROR' } });
  }
});

// POST /api/contact/:id/reply (Admin Only)
router.post('/:id/reply', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const id = req.params.id as string;
    const { replyMessage, replySubject } = req.body;

    if (!replyMessage || replyMessage.trim().length < 5) {
      res.status(400).json({
        success: false,
        message: 'Reply message of at least 5 characters is required.',
        error: { code: 'INVALID_INPUT' },
      });
      return;
    }

    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    // Send email via SMTP if configured, or log development preview
    const dispatchResult = await emailService.sendContactReply(
      message.email,
      message.name,
      replyMessage,
      replySubject || message.subject
    );

    // Mark status as REPLIED
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: 'REPLIED' },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.admin?.id,
        action: 'CONTACT_REPLY',
        entity: 'ContactMessage',
        entityId: id,
        details: {
          to: message.email,
          subject: replySubject || `Re: ${message.subject || 'Inquiry'}`,
          simulated: dispatchResult.simulated,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: dispatchResult.simulated
        ? `Reply previewed in server logs (Localhost Dev Mode)`
        : `Reply successfully delivered to ${message.email}`,
      data: { ...updated, simulated: dispatchResult.simulated },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to process reply',
      error: { code: 'REPLY_ERROR', details: (err as Error).message },
    });
  }
});

export const contactRoutes = router;
