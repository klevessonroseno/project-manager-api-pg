import express, { Express } from 'express';
import publicRoutes from './routes/public/routes';
import privateRoutes from './routes/private/routes';

class App {
  private server: Express;

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
    this.server.use(publicRoutes);
    this.server.use(privateRoutes);
  }
}

export default new App().getServer();