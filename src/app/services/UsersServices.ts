import { hash, compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

class UsersServices {
  generateUserId(): string {
    return uuidv4();
  };

  async encryptPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }

  async comparePasswords(password: string, encryptPassword: string): Promise<boolean> {
    return await compare(password, encryptPassword);
  }
}

export default new UsersServices();