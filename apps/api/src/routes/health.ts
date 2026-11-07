import { Router, Request, Response } from 'express';
import { ApiResponse } from '@amit/shared';

const router = Router();

router.get('/', (_req: Request, res: Response<ApiResponse>) => {
  res.status(200).json({
    success: true,
    message: 'Amit Chauhan Portfolio & CMS API is running smoothly',
    data: {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    },
  });
});

export const healthRoutes = router;

