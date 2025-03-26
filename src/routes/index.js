import { Router } from 'express';
import contactRouter  from './contacts.js';
import authRouter from './auth.js';

const routes = Router();

routes.use('/contacts', contactRouter );
routes.use('/auth', authRouter);

export default routes;