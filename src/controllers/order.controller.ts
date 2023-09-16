import { Request, Response } from 'express';
import statusCode from 'http-status';

import IRequestWithUserId from '../interfaces/request-with-user-id.interface';
import { ApiError } from '../responses/errors/api.error';
import { successResponse } from '../responses/success.response';
import orderService from '../services/order.service';
import productService from '../services/product.service';

class OrderController {
  async create(req: Request, res: Response) {
    let total = 0;
    const orderItems = [];

    for (const item of req.body.orderItems) {
      const product = await productService.getUserByUniqueField({ id: item.productId });

      if (!product) throw new ApiError(`Product not found: ${item.productId}`, statusCode.BAD_REQUEST);

      if (product.stock < item.quantity)
        throw new ApiError(`The product is out of stock: ${product.name}`, statusCode.BAD_REQUEST);

      total += product.price * item.quantity;

      await productService.update(product.id, { stock: product.stock - item.quantity });

      orderItems.push({ ...item, productName: product.name, price: product.price });
    }

    const product = await orderService.create({
      userId: (req as IRequestWithUserId).userId,
      total,
      address: req.body.address,
      orderItems,
    });

    successResponse({ res, statusCode: statusCode.OK, data: product });
  }

  async listOrderByCustomer(req: Request, res: Response) {
    const orders = await orderService.listByUser(parseInt(req.params.userId));

    successResponse({ res, statusCode: statusCode.OK, data: orders });
  }

  async get(req: Request, res: Response) {
    const order = await orderService.getOrderByUniqueField({ id: parseInt(req.params.orderId) });

    if (!order) throw new ApiError(`Order not found: ${req.params.orderId}`, statusCode.BAD_REQUEST);

    successResponse({ res, statusCode: statusCode.OK, data: order });
  }
}

export default new OrderController();
