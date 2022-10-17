import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { Request, Response, NextFunction } from 'express';
import { JwtPayloadToken } from '../rules/rules';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers; 

  if(!authorization) return response.status(400).json({
      error: 'Token not provided.',
  });

  const [ , token ] = authorization.split(' ');

  if(!token) return response.status(401).json({
      error: 'Token not provided.',
  });

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    const { userId, userName, userEmail } = decoded as JwtPayloadToken;

    request.manager.id = userId;
    request.manager.name = userName;
    request.manager.email = userEmail;

    return next();

  } catch (error) {
    return response.status(401).json({
      error: 'Invalid token.',
    });
  }
}