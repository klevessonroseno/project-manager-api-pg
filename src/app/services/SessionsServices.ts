import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { User } from '../domain/User';
import { Services } from './Services';

class SessionsServices extends Services {
  generateUserJwtToken(user: User) {
    const token = jwt.sign(
      { 
        userId: user.getId(), 
        userName: user.getName(),
        userEmail: user.getEmail(),
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