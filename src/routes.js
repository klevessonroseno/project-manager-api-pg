import express from 'express';

const routes = new express.Router();

routes.get('/', (request, response) => response.json({
  message: '',
}));

export default routes;