import express from 'express';
import usersResources from './app/resources/UsersResources';

const routes = new express.Router();

routes.get('/users', usersResources.getAll);

routes.post('/users', usersResources.store);

export default routes;