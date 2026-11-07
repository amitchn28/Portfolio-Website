import { Router, Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../db/prisma';
import { env } from '../config/env';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { loginLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { emailService } from '../services/email';
import { ApiResponse } from '@amit/shared';

const router = Router();

const loginSchema = z.object({
  email: z.string().min(1, 'Admin ID or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

// POST /api/auth/login
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { email, password } = req.body;

      // 1. Look up admin user (supports Admin ID / username 'admin' or direct email)
      const inputId = email.trim();
      const user = inputId.toLowerCase() === 'admin'
        ? await prisma.adminUser.findFirst()
        : await prisma.adminUser.findFirst({
            where: {
              OR: [
                { email: inputId },
                { email: { equals: inputId, mode: 'insensitive' } }
              ]
            },
          });

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials or inactive account.',
          error: { code: 'INVALID_CREDENTIALS' },
        });
        return;
      }

      // 2. Verify Argon2id password hash
      const isValid = await argon2.verify(user.passwordHash, password);
      if (!isValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials.',
          error: { code: 'INVALID_CREDENTIALS' },
        });
        return;
      }

      // 3. Generate session and JWT token
      const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const session = await prisma.adminSession.create({
        data: {
          userId: user.id,
          token: 'pending', // replaced below with signed JWT
          expiresAt: sessionExpiresAt,
          userAgent: req.headers['user-agent'] || null,
          ipAddress: req.ip || null,
        },
      });

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          sessionId: session.id,
        },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Update session with the signed token
      await prisma.adminSession.update({
        where: { id: session.id },
        data: { token },
      });

      // Update last login timestamp
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Log audit event
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'AUTH_LOGIN',
          entity: 'AdminUser',
          entityId: user.id,
          ipAddress: req.ip || null,
          details: { email: user.email },
        },
      });

      // Set secure HTTP-only cookie (supports cross-origin Vercel frontends in production)
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: env.IS_PROD,
        sameSite: env.IS_PROD ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          expiresAt: sessionExpiresAt.toISOString(),
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Internal error during login',
        error: { code: 'LOGIN_ERROR', details: (err as Error).message },
      });
    }
  }
);

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.admin,
      sessionId: req.sessionId,
    },
  });
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (req.sessionId) {
      await prisma.adminSession.delete({
        where: { id: req.sessionId },
      });
    }

    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: env.IS_PROD,
      sameSite: env.IS_PROD ? 'none' : 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: { code: 'LOGOUT_ERROR', details: (err as Error).message },
    });
  }
});

// POST /api/auth/change-password
router.post(
  '/change-password',
  requireAuth,
  validate(changePasswordSchema),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await prisma.adminUser.findUnique({
        where: { id: req.admin!.id },
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const isValid = await argon2.verify(user.passwordHash, currentPassword);
      if (!isValid) {
        res.status(400).json({
          success: false,
          message: 'Current password does not match.',
          error: { code: 'INVALID_PASSWORD' },
        });
        return;
      }

      const newHash = await argon2.hash(newPassword, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
      });

      await prisma.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });

      // Revoke all other sessions for security
      await prisma.adminSession.deleteMany({
        where: {
          userId: user.id,
          id: { not: req.sessionId },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Password update failed',
        error: { code: 'CHANGE_PASSWORD_ERROR', details: (err as Error).message },
      });
    }
  }
);

// POST /api/auth/forgot-password (Public, Rate-Limited)
router.post(
  '/forgot-password',
  loginLimiter,
  validate(z.object({ email: z.string().email('Invalid email') })),
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { email } = req.body;
      const user = await prisma.adminUser.findUnique({ where: { email } });

      // Always return identical message to prevent user enumeration
      const genericResponse = {
        success: true,
        message:
          'If the provided email is associated with an administrator account, password reset instructions have been dispatched.',
      };

      if (!user || !user.isActive) {
        res.status(200).json(genericResponse);
        return;
      }

      // Generate secure 15-minute reset token
      const resetToken = jwt.sign(
        { userId: user.id, email: user.email, type: 'pwd_reset' },
        env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      // Dispatch password reset email via configured provider (Resend, SMTP, or dev simulator)
      const dispatchResult = await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'PASSWORD_RESET_REQUESTED',
          entity: 'AdminUser',
          entityId: user.id,
          ipAddress: req.ip || null,
          details: { email: user.email, provider: dispatchResult.provider, simulated: dispatchResult.simulated },
        },
      });

      res.status(200).json({
        ...genericResponse,
        // Only in non-production development mode, surface debug token for convenient local automated testing
        ...(env.IS_PROD ? {} : { debugToken: resetToken, simulated: dispatchResult.simulated }),
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Password reset request failed',
        error: { code: 'FORGOT_PASSWORD_ERROR' },
      });
    }
  }
);

// POST /api/auth/reset-password (Public)
router.post(
  '/reset-password',
  loginLimiter,
  validate(
    z.object({
      token: z.string().min(1, 'Token is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    })
  ),
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { token, newPassword } = req.body;

      let decoded: any;
      try {
        decoded = jwt.verify(token, env.JWT_SECRET);
      } catch {
        res.status(400).json({
          success: false,
          message: 'The password reset token is invalid or has expired.',
          error: { code: 'INVALID_TOKEN' },
        });
        return;
      }

      if (decoded.type !== 'pwd_reset') {
        res.status(400).json({
          success: false,
          message: 'Invalid token type.',
          error: { code: 'INVALID_TOKEN' },
        });
        return;
      }

      const user = await prisma.adminUser.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        res.status(404).json({ success: false, message: 'Administrator account not found.' });
        return;
      }

      const newHash = await argon2.hash(newPassword, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
      });

      await prisma.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });

      // Invalidate all active sessions
      await prisma.adminSession.deleteMany({ where: { userId: user.id } });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'PASSWORD_RESET',
          entity: 'AdminUser',
          entityId: user.id,
          details: { ip: req.ip },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Password successfully reset. Please log in with your new credentials.',
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Password reset execution failed',
        error: { code: 'RESET_PASSWORD_ERROR' },
      });
    }
  }
);

// GET /api/auth/sessions (Admin Only)
router.get('/sessions', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const sessions = await prisma.adminSession.findMany({
      where: { userId: req.admin!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        currentSessionId: req.sessionId,
        sessions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions',
      error: { code: 'DB_ERROR' },
    });
  }
});

// DELETE /api/auth/sessions/:sessionId (Admin Only)
router.delete(
  '/sessions/:sessionId',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    try {
      const sessionId = req.params.sessionId as string;
      await prisma.adminSession.deleteMany({
        where: { id: sessionId, userId: req.admin!.id },
      });

      res.status(200).json({ success: true, message: 'Session revoked successfully' });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to revoke session',
        error: { code: 'REVOKE_ERROR' },
      });
    }
  }
);

export const authRoutes = router;

