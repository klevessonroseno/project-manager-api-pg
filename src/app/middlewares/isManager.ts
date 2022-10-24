import { Request, Response, NextFunction } from 'express';
import usersRepository from '../repositories/UsersRepository';

export async function isManager(req: Request, res: Response, next: NextFunction) {
  try {
    const { managerId }: { managerId: string } = req;

    if(!managerId || typeof managerId !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
      });
    }    

    const isManager = await usersRepository.isManager(managerId);

    if(!isManager) return res.status(401).json({
      error: 'Access Denied.',
    });
    
    return next();

  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}