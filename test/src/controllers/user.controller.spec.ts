import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import statusCode from 'http-status';
import jwt from 'jsonwebtoken';

import userController from '../../../src/controllers/user.controller';
import IRequestWithUserId from '../../../src/interfaces/request-with-user-id.interface';
import { ApiError } from '../../../src/responses/errors/api.error';
import userService from '../../../src/services/user.service';
import { clearDbTables } from '../../utils/database.util';
import prisma from '../../utils/prisma-client.util';
import { createDummyUser, generateUserData, TEST_PASSWORDS } from '../../utils/user.util';

describe('User Controller', () => {
  let dummyUsers: User[];

  beforeAll(async () => {
    await clearDbTables();
    dummyUsers = await createDummyUser(10);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const req = {} as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue('mockedSalt');
  jest.spyOn(bcrypt, 'hashSync').mockReturnValue(TEST_PASSWORDS.KBuser52.hashed);

  describe('getUsers', () => {
    it('should return user list', async () => {
      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(statusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: undefined,
        success: true,
        statusCode: statusCode.OK,
        data: dummyUsers,
      });
    });
  });

  describe('getUser', () => {
    it('should return user details', async () => {
      req.params = { userId: dummyUsers[0].id.toString() };

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(statusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: undefined,
        success: true,
        statusCode: statusCode.OK,
        data: dummyUsers[0],
      });
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const user = generateUserData();

      req.body = {
        ...user,
      };

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(statusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: undefined,
        success: true,
        statusCode: statusCode.OK,
        data: {
          ...user,
          password: TEST_PASSWORDS.KBuser52.hashed,
          id: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        },
      });
    });

    it('should throw error when user is exist', async () => {
      const user = dummyUsers[0];

      req.body = {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      await expect(userController.register(req, res)).rejects.toThrowError(
        new ApiError('User already exist', statusCode.BAD_REQUEST),
      );
    });

    it('should throw error when user not created', async () => {
      const user = dummyUsers[1];

      req.body = {
        email: 'email@gmail.com',
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      userService.register = jest.fn().mockResolvedValue(undefined);

      await expect(userController.register(req, res)).rejects.toThrowError(
        new ApiError('User not created', statusCode.BAD_REQUEST),
      );
    });
  });

  describe('login', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjYsImlhdCI6MTY5NDc3ODMwMSwiZXhwIjoxNjk0NzgxOTAxfQ.eUTedOkM1uEkfZ5A3Vd9wdplOmzLu9SpmQlHnCWelhU';

    it('should return accessToken when login is successfully', async () => {
      req.body = {
        email: dummyUsers[1].email,
        password: TEST_PASSWORDS.KBuser52.plain,
      };

      bcrypt.compareSync = jest.fn().mockReturnValue(true);
      jwt.sign = jest.fn().mockReturnValue(token);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(statusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: undefined,
        success: true,
        statusCode: statusCode.OK,
        data: token,
      });
    });

    it('should return error when user not found in database', async () => {
      req.body = {
        email: 'unexpected@gmail.com',
        password: TEST_PASSWORDS.KBuser52.plain,
      };

      await expect(userController.login(req, res)).rejects.toThrowError(
        new ApiError('User not found', statusCode.BAD_REQUEST),
      );
    });

    it('should return error when user password is wrong', async () => {
      req.body = {
        email: dummyUsers[1].email,
        password: TEST_PASSWORDS.KBuser52.plain,
      };

      bcrypt.compareSync = jest.fn().mockReturnValue(false);

      await expect(userController.login(req, res)).rejects.toThrowError(
        new ApiError('Invalid email or password', statusCode.BAD_REQUEST),
      );
    });
  });

  describe('profile', () => {
    it('should return current user profile', async () => {
      const user = dummyUsers[1];

      (req as IRequestWithUserId).userId = user.id;

      await userController.profile(req, res);

      expect(res.status).toHaveBeenCalledWith(statusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: undefined,
        success: true,
        statusCode: statusCode.OK,
        data: user,
      });
    });
  });
});
