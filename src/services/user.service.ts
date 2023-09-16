import { Prisma } from '@prisma/client';

import prisma from '../utils/prisma-client.util';
import { RegisterPayload } from '../validations/user.validation';

class UserService {
  async register(body: RegisterPayload) {
    const result = await prisma.user.create({
      data: body,
    });

    return result;
  }

  async list() {
    return await prisma.user.findMany();
  }

  async getUserByUniqueField(query: Prisma.UserWhereUniqueInput) {
    return await prisma.user.findUnique({ where: query });
  }
}

export default new UserService();
