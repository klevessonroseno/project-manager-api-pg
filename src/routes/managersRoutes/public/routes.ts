import { Router } from 'express';
import managersResources from '../../../app/resources/ManagersResources';
import sessionsResources from '../../../app/resources/SessionsResources';

const router = Router();

router.post('/managers', managersResources.store);

router.post('/managers/sessions', sessionsResources.store);

router.post('/managers/password/reset/', managersResources.resetPassword);

export default router;