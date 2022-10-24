import { hash } from 'bcrypt';

export async function encryptPassword(password: string): Promise<string> {
  return await hash(password, 12);
}