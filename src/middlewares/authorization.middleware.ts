import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status';

import IRequestWithUserId from '../interfaces/request-with-user-id.interface';
import { ApiError } from '../responses/errors/api.error';
import userService from '../services/user.service';

export const authorization = (roles: UserRole[]) => async (req: Request, _res: Response, next: NextFunction) => {
  const user = await userService.getUserByUniqueField({ id: (req as IRequestWithUserId).userId });

  if (!user) return next(new ApiError('User not found', statusCode.BAD_REQUEST));

  const role = roles.some((item) => item.includes(user.role));

  if (!role) return next(new ApiError("You don't have permission for this action", statusCode.FORBIDDEN));

  next();
};
