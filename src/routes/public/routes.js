import express from 'express';
import usersResources from '../../app/resources/UsersResources';
import sessionsResources from '../../app/resources/SessionsResources';

const routes = new express.Router();

routes.post('/users', usersResources.store);

routes.post('/users/sessions', sessionsResources.store);

routes.post('/users/password/reset/', usersResources.resetPassword);

export default routes;