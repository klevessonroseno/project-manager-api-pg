import { Router } from 'express';
import managersResources from '../../app/resources/ManagersResources';
import sessionsResources from '../../app/resources/SessionsResources';

const routes = Router();

routes.post('/managers', managersResources.store);

routes.post('/managers/sessions', sessionsResources.store);

routes.post('/managers/password/reset/', managersResources.resetPassword);

export default routes;