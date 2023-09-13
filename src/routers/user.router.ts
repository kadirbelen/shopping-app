import { UserRole } from '@prisma/client';
import express from 'express';

import userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorization } from '../middlewares/authorization.middleware';
import validator from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../validations/user.validation';

const router = express.Router();

router.post('/register', validator(registerSchema), userController.register);
router.post('/login', validator(loginSchema), userController.login);
router.get('/profile', authenticate, userController.profile);
router.get('/', authenticate, authorization([UserRole.ADMIN]), userController.getUsers);
router.get('/:userId', authenticate, authorization([UserRole.ADMIN]), userController.getUser);

export default router;
