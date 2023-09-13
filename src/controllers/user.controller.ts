import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import statusCode from 'http-status';

import IRequestWithUserId from '../interfaces/request-with-user-id.interface';
import { ApiError } from '../responses/errors/api.error';
import { successResponse } from '../responses/success.response';
import userService from '../services/user.service';
import { generateToken } from '../utils/generate-token.util';

class UserController {
  async register(req: Request, res: Response) {
    const salt = bcrypt.genSaltSync(10);
    const encrypted_password = bcrypt.hashSync(req.body.password, salt);

    const userIsExist = await userService.getUserByUniqueField({ email: req.body.email });

    if (userIsExist) throw new ApiError('User already exist', statusCode.BAD_REQUEST);

    const user = await userService.register({
      ...req.body,
      password: encrypted_password,
    });

    if (!user) throw new ApiError('User not created', statusCode.BAD_REQUEST);

    successResponse({ res, statusCode: statusCode.OK, data: user });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userService.getUserByUniqueField({ email });

    if (!user) throw new ApiError('User not found', statusCode.BAD_REQUEST);

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) throw new ApiError('Invalid email or password', statusCode.BAD_REQUEST);

    const token = await generateToken(user.id);

    successResponse({ res, statusCode: statusCode.OK, data: token });
  }

  async profile(req: Request, res: Response) {
    const user = await userService.getUserByUniqueField({ id: (req as IRequestWithUserId).userId });

    successResponse({ res, statusCode: statusCode.OK, data: user });
  }

  async getUsers(_req: Request, res: Response) {
    const users = await userService.getUsers();

    successResponse({ res, statusCode: statusCode.OK, data: users });
  }

  async getUser(req: Request, res: Response) {
    const user = await userService.getUserByUniqueField({ id: parseInt(req.params.userId) });

    successResponse({ res, statusCode: statusCode.OK, data: user });
  }
}

export default new UserController();
