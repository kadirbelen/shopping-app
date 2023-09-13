import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status';
import jwt from 'jsonwebtoken';

import IRequestWithUserId from '../interfaces/request-with-user-id.interface';
import { ApiError } from '../responses/errors/api.error';

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.header('Authorization');

  if (!authorization) {
    return next(new ApiError('Access denied. No token provided', statusCode.UNAUTHORIZED));
  }

  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string, (error, decoded) => {
    if (error) return next(new ApiError(error.message, statusCode.UNAUTHORIZED));

    (req as IRequestWithUserId).userId = (decoded as { _id: number })._id;

    next();
  });
}
