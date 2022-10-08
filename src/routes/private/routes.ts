import { Router } from 'express';
import usersResources from '../../app/resources/UsersResources';
import collaboratorsResources from '../../app/resources/CollaboratorsResources';
import authMiddleware from '../../app/middlewares/auth';

const routes = Router();

routes.use(authMiddleware);

routes.put('/users', usersResources.update);

routes.post('/users/collaborators', collaboratorsResources.store);

export default routes;