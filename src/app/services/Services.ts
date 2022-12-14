import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';

export abstract class Services {
  generateId(): string {
    return uuidv4();
  };

  generatePassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  async encryptPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }

  async comparePasswords(password: string, encryptPassword: string): Promise<boolean> {
    return await compare(password, encryptPassword);
  }
}