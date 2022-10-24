import { Router } from 'express';
import managersResources from '../../../app/resources/ManagersResources';
import sessionsResources from '../../../app/resources/SessionsResources';
import usersResources from '../../../app/resources/UsersResources';

const router = Router();

router.post('/users', usersResources.store);

router.post('/sessions', sessionsResources.store);

router.post('/password/reset/', usersResources.resetPassword);

export default router;