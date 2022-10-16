import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { User } from '../domain/User';

class SessionsServices {
  async comparePasswords(password: string, encryptPassword: string) {
    return await compare(password, encryptPassword);
  }

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