import { Request, Response, NextFunction } from 'express';
import { ComponentSchema } from '../types/component';

export function validateComponent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    ComponentSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
}
