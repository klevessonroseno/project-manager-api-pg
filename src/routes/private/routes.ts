import { Router } from 'express';
import usersResources from '../../app/resources/UsersResources';
import collaboratorsResources from '../../app/resources/CollaboratorsResources';
import authMiddleware from '../../app/middlewares/auth';

const routes = Router();

routes.use(authMiddleware);

routes.put('/users', usersResources.update);

routes.post('/collaborators', collaboratorsResources.store);

routes.get('/collaborators', collaboratorsResources.find);

export default routes;