import express from 'express';
import publicRoutes from './routes/public/routes';
import privateRoutes from './routes/private/routes';

class App {
  constructor() {
    this.server = express();
    
    this.middlewares();
    this.routes()
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(publicRoutes);
    this.server.use(privateRoutes);
  }
}

export default new App().server;