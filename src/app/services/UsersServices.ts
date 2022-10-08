import { hash, compare } from 'bcrypt';

class UsersServices {
  async encryptPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }

  async comparePasswords(password: string, encryptPassword: string): Promise<boolean> {
    return await compare(password, encryptPassword);
  }
}

export default new UsersServices();