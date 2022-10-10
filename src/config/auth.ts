import { config } from 'dotenv';

config();

export default {
  secret: String(process.env.AUTH_SECRET),
  expiresIn: String(process.env.AUTH_EXPIRES_IN),
};