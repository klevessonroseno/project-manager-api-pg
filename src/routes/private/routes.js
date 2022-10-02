import express from 'express';
import usersResources from '../../app/resources/UsersResources';
import authMiddleware from '../../app/middlewares/auth';

const routes = new express.Router();

routes.use(authMiddleware);

export default routes;