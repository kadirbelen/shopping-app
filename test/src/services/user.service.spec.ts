import { User, UserRole } from '@prisma/client';

import userService from '../../../src/services/user.service';
import { RegisterPayload } from '../../../src/validations/user.validation';
import { clearDbTables } from '../../utils/database.util';
import prisma from '../../utils/prisma-client.util';
import { createDummyUser, TEST_PASSWORDS } from '../../utils/user.util';

describe('User Service', () => {
  let dummyUsers: User[];

  beforeAll(async () => {
    await clearDbTables();
    dummyUsers = await createDummyUser(10);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('list', () => {
    it('should return user list', async () => {
      const result = await userService.list();

      expect(result).toEqual(dummyUsers);
    });
  });

  describe('getUserByUniqueField', () => {
    it('should return user', async () => {
      const result = await userService.getUserByUniqueField({ email: dummyUsers[0].email });

      expect(result).toEqual(dummyUsers[0]);
    });
  });

  describe('register', () => {
    it('should create user and return created user', async () => {
      const payload: RegisterPayload = {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test-unique@gmail.com',
        password: TEST_PASSWORDS.KBuser52.hashed,
      };

      const result = await userService.register(payload);

      expect(result).toEqual({
        ...payload,
        role: UserRole.CUSTOMER,
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });
  });
});
