import * as Yup from 'yup';
import usersRepository from '../repositories/UsersRepository';
import { Request, Response } from 'express';
import { compare } from 'bcrypt';
import { generateJwtToken } from '../helpers/generateJwtToken';

class SessionsResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        email:  Yup.string().email().required().max(200),
        password: Yup.string().required().min(6).max(10),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) return response.status(400).json({
          error: 'Bad Request.',
      });

      const { 
        email, 
        password 
      }: { 
        email: string, 
        password: string 
      } = request.body;

      if(typeof password !== 'string') return response.status(400).json({
        error: 'Bad Request.',
      });

      const emailExists = await usersRepository.emailExists(email);

      if(!emailExists) return response.status(401).json({
          error: 'Invalid email or password.',
      });

      const user = await usersRepository.getByEmail(email);
      const passwordsMatch = await compare(password, user.getPassword());

      if(!passwordsMatch) return response.status(401).json({
          error: 'Invalid email or password.',
      }); 
      
      const token = generateJwtToken(user);

      return response.status(200).json({ token });

    } catch (error) {
      return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });
    }
  }
}

export default new SessionsResources();