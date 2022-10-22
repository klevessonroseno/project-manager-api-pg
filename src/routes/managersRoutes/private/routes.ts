import { Router } from 'express';
import managersResources from '../../../app/resources/ManagersResources';
import collaboratorsResources from '../../../app/resources/CollaboratorsResources';
import authManagerMiddleware from '../../../app/middlewares/authManager';
import projectsResources from '../../../app/resources/ProjectsResources';

const router = Router();

router.use(authManagerMiddleware);

router.put('/managers', managersResources.update);

router.post('/managers/collaborators', collaboratorsResources.store);

router.put('/managers/collaborators', collaboratorsResources.update);

router.delete('/managers/collaborators', collaboratorsResources.delete);

router.get('/managers/collaborators', collaboratorsResources.find);

router.post('/managers/projects', projectsResources.store);

router.get('/managers/projects', projectsResources.find);

export default router;