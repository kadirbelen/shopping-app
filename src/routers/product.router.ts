import { UserRole } from '@prisma/client';
import express from 'express';

import productController from '../controllers/product.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorization } from '../middlewares/authorization.middleware';
import validator from '../middlewares/validation.middleware';
import { createSchema, updateSchema } from '../validations/product.validation';

const router = express.Router();

router.post('/', authenticate, authorization([UserRole.ADMIN]), validator(createSchema), productController.create);
router.patch(
  '/:productId',
  authenticate,
  authorization([UserRole.ADMIN]),
  validator(updateSchema),
  productController.update,
);
router.get('/', productController.list);
router.get('/:productId', productController.get);

export default router;
