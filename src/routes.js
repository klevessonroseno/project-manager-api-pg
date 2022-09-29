const express = require('express');

const routes = new express.Router();

routes.get('/', (request, response) => response.json({
  message: 'Hello',
}));

module.exports = routes;