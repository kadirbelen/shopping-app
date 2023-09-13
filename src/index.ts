import 'dotenv/config';
import 'express-async-errors';

import express from 'express';

import { errorHandler } from './middlewares/error-handler.middleware';
import productRouter from './routers/product.router';
import userRouter from './routers/user.router';

const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/products', productRouter);

app.use(errorHandler);

app.listen(3000 || process.env.PORT, () => {
  console.info('application is running');
});
