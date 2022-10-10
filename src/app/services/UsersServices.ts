import { hash, compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../domain/User';
import usersRepository from '../repositories/UsersRepository';

class UsersServices {
  private generateUserId(): string {
    return uuidv4();
  };

  private async encryptPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }

  private create(name: string, email: string, password: string): User {
    const id = this.generateUserId();
    const encryptPassword = String(this.encryptPassword(password));

    return new User(id, name, email, encryptPassword); 
  }

  private async store(user: User): Promise<boolean> {
    const userSaved = await usersRepository.save(user);

    if(userSaved) {
      return true;
    }

    return false;
  };

  public async comparePasswords(password: string, encryptPassword: string): Promise<boolean> {
    return await compare(password, encryptPassword);
  }

  public async save(name: string, email: string, password: string): Promise<boolean> {
    const user = this.create(name, email, password);
    
    return this.store(user);
  }

  public async checkIfUserExistsByEmail(email: string): Promise<boolean> {
    return await usersRepository.checkIfUserExistsByEmail(email);
  }
}

export default new UsersServices();