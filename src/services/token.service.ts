import { Prisma, PrismaClient } from '@prisma/client';

class TokenService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserToken({ userId }: Prisma.UserTokenWhereUniqueInput) {
    return await this.prisma.userToken.findUnique({ where: { userId } });
  }

  async upsert(userId: number, token: string) {
    return await this.prisma.userToken.upsert({ where: { userId }, update: { token }, create: { userId, token } });
  }
}

export default new TokenService();
