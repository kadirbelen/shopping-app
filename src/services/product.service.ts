import { Prisma } from '@prisma/client';

import prisma from '../utils/prisma-client.util';

class ProductService {
  async create(body: Prisma.ProductCreateInput) {
    return await prisma.product.create({
      data: body,
    });
  }

  async update(productId: number, body: Prisma.ProductUpdateInput) {
    return await prisma.product.update({
      where: { id: productId },
      data: body,
    });
  }

  async list() {
    return await prisma.product.findMany();
  }

  async getUserByUniqueField(query: Prisma.ProductWhereUniqueInput) {
    return await prisma.product.findUnique({ where: query });
  }
}

export default new ProductService();
