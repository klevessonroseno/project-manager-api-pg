import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class SessionsServices {
  async comparePasswords(password, encryptPassword) {
    return await compare(password, encryptPassword);
  }

  generateJwtToken(user) {
    const token = jwt.sign(
      { 
        userId: user.id, 
        userName: user.name,
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