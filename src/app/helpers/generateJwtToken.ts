import { User } from "../domain/User";
import * as jwt from 'jsonwebtoken';
import { authConfig } from "../../config/auth";

export function generateJwtToken(user: User): string {
  const token = jwt.sign(
    { 
      id: user.getId(), 
      name: user.getName(),
      email: user.getEmail(),
    },
    authConfig.secret,
    {
      expiresIn: authConfig.expiresIn,
    }
  );
  return token;
}