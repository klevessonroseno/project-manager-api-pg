import express from 'express';
import usersResources from '../../app/resources/UsersResources';
import authMiddleware from '../../app/middlewares/auth';

const routes = new express.Router();

routes.use(authMiddleware);

routes.put('/users', usersResources.update);

export default routes;