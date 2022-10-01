import express from 'express';
import usersResources from '../app/resources/UsersResources';
import sessionsResources from '../app/resources/SessionsResources';

const routes = new express.Router();

// Public Routes for Users

routes.post('/sessions', sessionsResources.store)

routes.get('/users', usersResources.getAll);

routes.post('/users', usersResources.store);

// Private Routes for Users

export default routes;