import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { Manager } from '../domain/Manager';
import { Services } from './Services';

class SessionsServices extends Services {
  generateManagerJwtToken(manager: Manager) {
    const token = jwt.sign(
      { 
        userId: manager.getId(), 
        userName: manager.getName(),
        userEmail: manager.getEmail(),
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      }
    );
    return token;
  }
}

export default new SessionsServices();