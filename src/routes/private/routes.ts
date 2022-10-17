import { Router } from 'express';
import managersResources from '../../app/resources/ManagersResources';
import collaboratorsResources from '../../app/resources/CollaboratorsResources';
import authMiddleware from '../../app/middlewares/auth';

const routes = Router();

routes.use(authMiddleware);

routes.put('/managers', managersResources.update);

routes.post('/collaborators', collaboratorsResources.store);

routes.get('/collaborators', collaboratorsResources.find);

export default routes;