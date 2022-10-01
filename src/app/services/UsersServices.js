import { hash, compare } from 'bcrypt';

class UsersServices {
  async encryptPassword(password) {
    return await hash(password, 12);
  }

  async comparePasswords(password, encryptPassword) {
    return await compare(password, encryptPassword);
  }
}

export default new UsersServices();