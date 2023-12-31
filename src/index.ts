import 'dotenv/config';
import 'express-async-errors';

import express from 'express';

import { logger, pinoLogger } from './configs/logger.config';
import { errorHandler } from './middlewares/error-handler.middleware';
import orderRouter from './routers/order.router';
import productRouter from './routers/product.router';
import userRouter from './routers/user.router';

const app = express();

app.use(express.json());

app.use(logger);

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

app.use(errorHandler);

app.listen(3000 || process.env.PORT, () => {
  pinoLogger.info('application is running');
});
