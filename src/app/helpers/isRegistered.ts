import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';
import usersRepository from '../repositories/UsersRepository';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Yup.object().shape({
      email: Yup.string().email().required().max(200),
    });

    const schemaIsValid = await schema.isValid(req.body);

    if(!schemaIsValid) return res.status(400).json({
      error: 'Bad Request',
    });

    const { email }: { email: string } = req.body;

    const isRegistered = await usersRepository.isRegistered(email);

    if(!isRegistered) return res.status(401).json({
      error: 'Email not registered.',
    });
    
    return next();
    
  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again in a few minutes.',
    });
  }
}