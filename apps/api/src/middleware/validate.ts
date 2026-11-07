import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '@amit/shared';

export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed for request payload',
          error: {
            code: 'VALIDATION_ERROR',
            details: issues,
          },
        });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          error: {
            code: 'QUERY_VALIDATION_ERROR',
            details: error.errors,
          },
        });
        return;
      }
      next(error);
    }
  };
}

