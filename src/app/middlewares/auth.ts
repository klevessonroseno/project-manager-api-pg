import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { Request, Response, NextFunction } from 'express';
import { JwtPayloadToken } from '../rules/rules';

export async function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers; 

  if(!authorization) return res.status(400).json({
      error: 'Token not provided.',
  });

  const [ , token ] = authorization.split(' ');

  if(!token) return res.status(401).json({
      error: 'Token not provided.',
  });

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    const { managerId, managerName, managerEmail } = decoded as JwtPayloadToken;
    
    req.managerId = managerId;
    req.managerName = managerName;
    req.managerEmail = managerEmail;

    return next();
    
  
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token.',
    });
  }
}