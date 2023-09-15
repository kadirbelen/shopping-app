import { Request, Response } from 'express';
import statusCode from 'http-status';
import jwt from 'jsonwebtoken';

import IRequestWithUserId from '../../../src/interfaces/request-with-user-id.interface';
import { authenticate } from '../../../src/middlewares/authenticate.middleware';
import { ApiError } from '../../../src/responses/errors/api.error';

describe('authenticate', () => {
  const res = {} as Response;
  const next = jest.fn();

  it('should authenticate user when valid token', async () => {
    const validToken = 'valid-token';
    const decodedToken = { _id: 123 };

    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${validToken}`),
    } as unknown as Request;

    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
      expect(token).toBe(validToken);
      expect(secret).toBe(process.env.ACCESS_TOKEN_SECRET_KEY);
      callback(null, decodedToken);
    });

    await authenticate(req, res, next);

    expect((req as IRequestWithUserId).userId).toBe(decodedToken._id);
    expect(next).toHaveBeenCalled();
  });

  it('should return error when no token provided', async () => {
    const req = {
      header: jest.fn(),
    } as unknown as Request;

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(new ApiError('Access denied. No token provided', statusCode.UNAUTHORIZED));
  });

  it('should return error when invalid token', async () => {
    const invalidToken = 'invalid-token';

    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${invalidToken}`),
    } as unknown as Request;

    const errMessage = 'Invalid token';

    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
      expect(token).toBe(invalidToken);
      expect(secret).toBe(process.env.ACCESS_TOKEN_SECRET_KEY);
      callback(new Error(errMessage));
    });

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(new ApiError(errMessage, statusCode.UNAUTHORIZED));
  });
});
