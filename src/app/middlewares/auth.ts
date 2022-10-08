import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import { Request, Response, NextFunction } from 'express';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers; 

  if(!authorization) {
    return response.status(400).json({
      error: 'Request header does not contain authorization attribute.',
    });
  }

  const [ , token ] = authorization.split(' ');

  if(!token) {
    return response.status(401).json({
      error: 'Token not provided.',
    });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    
    request.userId = decoded.userId;
    request.userName = decoded.userName;

    return next();

  } catch (error) {
    return response.status(401).json({
      error: 'Invalid token.',
    });
  }
}