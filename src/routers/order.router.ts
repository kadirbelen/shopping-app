import { UserRole } from '@prisma/client';
import express from 'express';

import orderController from '../controllers/order.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorization } from '../middlewares/authorization.middleware';
import validator from '../middlewares/validation.middleware';
import { createSchema } from '../validations/order.validation';

const router = express.Router();

router.post('/', authenticate, authorization([UserRole.CUSTOMER]), validator(createSchema), orderController.create);
router.get('/user/:userId', authenticate, orderController.listOrderByCustomer);
router.get('/:orderId', authenticate, orderController.getOrderDetails);

export default router;
