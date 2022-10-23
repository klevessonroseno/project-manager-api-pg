import { Router } from 'express';
import managersResources from '../../../app/resources/ManagersResources';
import sessionsResources from '../../../app/resources/SessionsResources';
import isManager from '../../../app/helpers/isManager';
import isRegistered from '../../../app/helpers/isRegistered';
import usersResources from '../../../app/resources/UsersResources';

const router = Router();

router.post('/users', usersResources.save);

router.post('/users/test', isRegistered, isManager, usersResources.test);

router.post('/managers', managersResources.store);

router.post('/managers/sessions', sessionsResources.store);

router.post('/managers/password/reset/', managersResources.resetPassword);

export default router;