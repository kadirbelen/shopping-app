import { Request, Response } from 'express';
import statusCode from 'http-status';

import { ApiError } from '../responses/errors/api.error';
import { successResponse } from '../responses/success.response';
import productService from '../services/product.service';

class ProductController {
  async create(req: Request, res: Response) {
    const product = await productService.create(req.body);

    successResponse({ res, statusCode: statusCode.OK, data: product });
  }

  async update(req: Request, res: Response) {
    const product = await productService.update(parseInt(req.params.productId), req.body);

    successResponse({ res, statusCode: statusCode.OK, data: product });
  }

  async get(req: Request, res: Response) {
    const product = await productService.getUserByUniqueField({ id: parseInt(req.params.productId) });

    if (!product) throw new ApiError('Product not found', statusCode.BAD_REQUEST);

    successResponse({ res, statusCode: statusCode.OK, data: product });
  }

  async list(_req: Request, res: Response) {
    const product = await productService.list();

    successResponse({ res, statusCode: statusCode.OK, data: product });
  }
}

export default new ProductController();
