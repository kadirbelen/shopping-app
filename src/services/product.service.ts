import { Prisma, PrismaClient } from '@prisma/client';

class ProductService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(body: Prisma.ProductCreateInput) {
    return await this.prisma.product.create({
      data: body,
    });
  }

  async update(productId: number, body: Prisma.ProductUpdateInput) {
    return await this.prisma.product.update({
      where: { id: productId },
      data: body,
    });
  }

  async list() {
    return await this.prisma.product.findMany();
  }

  async getUserByUniqueField(query: Prisma.ProductWhereUniqueInput) {
    return await this.prisma.product.findUnique({ where: query });
  }
}

export default new ProductService();
