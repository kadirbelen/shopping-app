import 'dotenv/config';

import express from 'express';

const app = express();

app.listen(3000, () => {
  console.info('application is running');
});
