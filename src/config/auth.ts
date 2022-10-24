import { config } from 'dotenv';

config();

export const authConfig = {
  secret: String(process.env.AUTH_SECRET),
  expiresIn: String(process.env.AUTH_EXPIRES_IN),
};