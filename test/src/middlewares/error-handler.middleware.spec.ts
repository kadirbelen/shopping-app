import { Request, Response } from 'express';
import statusCode from 'http-status';
import { ZodError, ZodIssue } from 'zod';

import { pinoLogger } from '../../../src/configs/logger.config';
import { errorHandler } from '../../../src/middlewares/error-handler.middleware';
import { ApiError } from '../../../src/responses/errors/api.error';
import { ValidationError } from '../../../src/responses/errors/validation.error';

describe('errorHandler', () => {
  const req = {} as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  pinoLogger.error = jest.fn();

  const next = jest.fn();

  it('should handle ApiError correctly', () => {
    const apiError = new ApiError('ApiError message', statusCode.BAD_REQUEST);

    errorHandler(apiError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(statusCode.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(apiError.toJSON());
    expect(pinoLogger.error).not.toHaveBeenCalled();
  });

  it('should handle ValidationError correctly', () => {
    const zodErrors: ZodIssue[] = [
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['firstName'],
        message: 'Required',
      },
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['lastName'],
        message: 'Required',
      },
    ];

    const validationError = new ValidationError(new ZodError(zodErrors));

    errorHandler(validationError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(statusCode.UNPROCESSABLE_ENTITY);
    expect(res.json).toHaveBeenCalledWith(validationError.toJSON());
    expect(pinoLogger.error).not.toHaveBeenCalled();
  });

  it('should handle Unknown Error correctly', () => {
    const unknownError = new Error('Unknown Error');

    errorHandler(unknownError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(statusCode.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        {
          message: 'Internal Server Error',
        },
      ],
      success: false,
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
    });
    expect(pinoLogger.error).toHaveBeenCalledWith('Internal server error', unknownError);
  });
});
