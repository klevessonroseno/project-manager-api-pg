import { Router } from 'express';
import collaboratorsResources from '../../app/resources/CollaboratorsResources';
import { auth } from '../../app/middlewares/auth';
import { isManager } from '../../app/middlewares/isManager';
import projectsResources from '../../app/resources/ProjectsResources';
import usersResources from '../../app/resources/UsersResources';
import tasksResources from '../../app/resources/TasksResources';

const router = Router();

router.use(auth);
router.use(isManager);

router.put('/users', usersResources.update);

router.post('/projects', projectsResources.store);

router.get('/projects', projectsResources.find);

router.post('/tasks', tasksResources.store);

router.get('/tasks', tasksResources.find);

router.post('/collaborators', collaboratorsResources.store);

router.put('/collaborators', collaboratorsResources.update);

router.delete('/collaborators', collaboratorsResources.delete);

router.get('/collaborators', collaboratorsResources.find);



export default router;