import { Router } from 'express';
import managersRoutes from './managersRoutes/index';

const routes = Router();

routes.use(managersRoutes);

export default routes;