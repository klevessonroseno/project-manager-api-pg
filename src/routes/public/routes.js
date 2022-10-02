import express from 'express';
import usersResources from '../../app/resources/UsersResources';
import sessionsResources from '../../app/resources/SessionsResources';

const routes = new express.Router();

routes.post('/sessions', sessionsResources.store);

routes.get('/users', usersResources.getAll);

routes.post('/users', usersResources.store);

export default routes;