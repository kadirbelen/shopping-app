import 'dotenv/config';

import express from 'express';

import { errorHandler } from './middlewares/error-handler.middleware';

const app = express();
app.use(express.json());

app.use(errorHandler);

app.listen(3000, () => {
  console.info('application is running');
});
