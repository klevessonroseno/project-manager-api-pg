import { Router } from 'express';
import managersResources from '../../../app/resources/ManagersResources';
import collaboratorsResources from '../../../app/resources/CollaboratorsResources';
import { auth } from '../../../app/middlewares/auth';
import { isManager } from '../../../app/middlewares/isManager';
import projectsResources from '../../../app/resources/ProjectsResources';
import usersResources from '../../../app/resources/UsersResources';

const router = Router();

router.use(auth);
router.use(isManager);

router.put('/users', usersResources.update);

router.post('/managers/collaborators', collaboratorsResources.store);

router.put('/managers/collaborators', collaboratorsResources.update);

router.delete('/managers/collaborators', collaboratorsResources.delete);

router.get('/managers/collaborators', collaboratorsResources.find);

router.post('/managers/projects', projectsResources.store);

router.get('/managers/projects', projectsResources.find);

export default router;