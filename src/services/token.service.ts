import { Prisma } from '@prisma/client';

import prisma from '../utils/prisma-client.util';

class TokenService {
  async getUserToken({ userId }: Prisma.UserTokenWhereUniqueInput) {
    return await prisma.userToken.findUnique({ where: { userId } });
  }

  async upsert(userId: number, token: string) {
    return await prisma.userToken.upsert({ where: { userId }, update: { token }, create: { userId, token } });
  }
}

export default new TokenService();
