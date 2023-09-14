import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

import { ValidationError } from '../responses/errors/validation.error';

export default function (schema: ZodSchema) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log('res.error-->>', result.error);

      return next(new ValidationError(result.error));
    } else {
      req.body = result.data;

      next();
    }
  };
}
