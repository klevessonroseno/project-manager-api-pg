import express, { Express } from 'express';
import routes from './routes/index';

class App {
  private readonly server: Express;

  constructor() {
    this.server = express(); 
    this.middlewares();
    this.routes()
  }

  getServer(): Express {
    return this.server;
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().getServer();