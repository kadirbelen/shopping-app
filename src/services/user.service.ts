import { Prisma, PrismaClient } from '@prisma/client';

import { RegisterPayload } from '../validations/user.validation';

class UserService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async register(body: RegisterPayload) {
    const result = await this.prisma.user.create({
      data: body,
    });

    return result;
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserByUniqueField(query: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUnique({ where: query });
  }
}

export default new UserService();
