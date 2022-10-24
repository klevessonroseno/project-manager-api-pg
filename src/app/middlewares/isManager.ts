import { Request, Response, NextFunction } from 'express';
import usersRepository from '../repositories/UsersRepository';

export async function isManager(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req;  
    const isManager = await usersRepository.isManager(id);

    if(!isManager) return res.status(401).json({
      error: 'Unauthorized.',
    });
    
    return next();

  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}