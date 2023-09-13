import express from 'express';

import userController from '../controllers/user.controller';
import validator from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../validations/user.validation';

const router = express.Router();

router.post('/register', validator(registerSchema), userController.register);
router.post('/login', validator(loginSchema), userController.login);
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);

export default router;
