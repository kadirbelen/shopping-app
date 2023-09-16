import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { pinoLogger } from '../configs/logger.config';
import { ApiError } from '../responses/errors/api.error';
import { ValidationError } from '../responses/errors/validation.error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json(err.toJSON());
  } else if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  pinoLogger.error('Internal server error', err);

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    errors: [
      {
        message: 'Internal Server Error',
      },
    ],
    success: false,
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
  });
};
