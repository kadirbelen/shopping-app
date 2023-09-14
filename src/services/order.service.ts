import { Prisma } from '@prisma/client';

import prisma from '../utils/prisma-client.util';

class OrderService {
  async create({
    userId,
    total,
    address,
    orderItems,
  }: {
    userId: number;
    total: number;
    address: string;
    orderItems: Prisma.OrderItemUncheckedCreateInput[];
  }) {
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        address,
        orderItems: {
          create: orderItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            productName: item.productName,
          })),
        },
      },
      include: { user: true, orderItems: true },
    });

    return order;
  }

  async listByUser(userId: number) {
    return await prisma.order.findMany({
      where: { userId },
      include: { user: true, orderItems: true },
    });
  }

  async getUserByUniqueField(query: Prisma.OrderWhereUniqueInput) {
    return await prisma.order.findUnique({ where: query, include: { user: true, orderItems: true } });
  }
}

export default new OrderService();
