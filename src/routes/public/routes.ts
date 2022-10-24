import { Router } from 'express';
import sessionsResources from '../../app/resources/SessionsResources';
import usersResources from '../../app/resources/UsersResources';

const router = Router();

router.post('/users', usersResources.store);

router.post('/sessions', sessionsResources.store);

router.post('/password', usersResources.resetPassword);

export default router;