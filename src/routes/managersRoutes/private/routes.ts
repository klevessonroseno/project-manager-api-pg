import { Router } from 'express';
import managersResources from '../../../app/resources/ManagersResources';
import collaboratorsResources from '../../../app/resources/CollaboratorsResources';
import authManagerMiddleware from '../../../app/middlewares/authManager';

const router = Router();

router.use(authManagerMiddleware);

router.put('/managers', managersResources.update);

router.post('/managers/collaborators', collaboratorsResources.store);

router.get('/managers/collaborators', collaboratorsResources.find);

export default router;