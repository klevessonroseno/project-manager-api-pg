import { hash } from 'bcrypt';

class UsersServices {
  async encryptPassword(password) {
    return await hash(password, 12);
  }
}

export default new UsersServices();