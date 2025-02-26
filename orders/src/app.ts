import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler , NotfoundError, currentUser } from '@pctickets/common';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';  

const app = express();
//app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
  //  secure: true process.env.NODE_ENV !== true
  })
);

app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async() => {
    throw new NotfoundError();
})

app.use(errorHandler)

export { app }