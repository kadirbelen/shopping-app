import { Request, Response } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

import validationMiddleware from '../../../src/middlewares/validation.middleware';
import { ValidationError } from '../../../src/responses/errors/validation.error';

describe('validationMiddleware', () => {
  const schema = z.object({
    email: z.string().email(),
    age: z.number().int(),
    isActive: z.boolean().default(true),
  });

  const req = {} as Request;

  const res = {} as Response;

  const next = jest.fn();

  it('should pass when valid data', () => {
    req.body = { email: 'test@example.com', age: 30 };

    validationMiddleware(schema)(req, res, next);

    expect(req.body).toEqual({ ...req.body, isActive: true });
    expect(next).toHaveBeenCalled();
  });

  it('should throw ValidationError when invalid data', () => {
    req.body = { email: 'invalid-email', age: 'not-a-number' };

    validationMiddleware(schema)(req, res, next);

    const errors: ZodIssue[] = [
      {
        validation: 'email',
        code: 'invalid_string',
        message: 'Invalid email',
        path: ['email'],
      },
      {
        code: 'invalid_type',
        expected: 'number',
        received: 'string',
        path: ['age'],
        message: 'Expected number, received string',
      },
    ];

    expect(next).toHaveBeenCalledWith(new ValidationError(new ZodError(errors)));
  });
});
