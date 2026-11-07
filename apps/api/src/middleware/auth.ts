import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../db/prisma';
import { ApiResponse } from '@amit/shared';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  sessionId?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Extract token from HTTP-only cookie or Authorization header
    let token = req.cookies?.admin_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No session token provided.',
        error: { code: 'UNAUTHORIZED' },
      });
      return;
    }

    // 2. Verify JWT signature
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (!decoded.userId) {
        throw new Error('Invalid token payload');
      }
    } catch {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired session token.',
        error: { code: 'TOKEN_INVALID' },
      });
      return;
    }

    // 3. Verify session in PostgreSQL database
    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date() || !session.user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Session has been revoked or expired. Please log in again.',
        error: { code: 'SESSION_EXPIRED' },
      });
      return;
    }

    // 4. Attach admin context to request
    req.admin = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
    req.sessionId = session.id;

    next();
  } catch (err) {
    next(err);
  }
}
