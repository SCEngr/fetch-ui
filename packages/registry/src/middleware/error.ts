import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { APIError } from '../errors';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request data',
      details: error.errors,
    });
  } else if (error instanceof APIError) {
    const status = {
      COMPONENT_NOT_FOUND: 404,
      VERSION_NOT_FOUND: 404,
      VERSION_CONFLICT: 409,
    }[error.code] || 500;

    res.status(status).json({
      code: error.code,
      message: error.message,
    });
  } else {
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    });
  }
}
