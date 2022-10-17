import { Router } from 'express';
import publicRoutes from './public/routes';
import privateRoutes from './private/routes';

const routes = Router();

routes.use(publicRoutes);
routes.use(privateRoutes);

export default routes;
