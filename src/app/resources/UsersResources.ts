import { Request, Response } from 'express';
import usersRepository from '../repositories/UsersRepository';
import * as Yup from 'yup';
import { generateId } from '../helpers/generateId';
import { encryptPassword } from '../helpers/encryptPassword';

class UsersResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required().max(200),
        email: Yup.string().email().required().max(200),
        password: Yup.string().required().min(6).max(10),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) return response.status(400).json({
          error: 'Bad Request.',
      });
      
      const { name, email, password }: {
        name: string,
        email: string,
        password: string,
      } = request.body;

      if(typeof name !== 'string'|| typeof password !== 'string') {
        return response.status(400).json({
          error: 'Bad Request.',          
        });
      }

      const emailExists = await usersRepository.emailExists(email);

      if(emailExists) return response.status(409).json({
        error: 'E-mail already registered.',
      });
      
      const id = generateId();

      const idExists = await usersRepository.idExists(id);

      if(idExists) return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });

      const encrypted = await encryptPassword(password);
      const userCreated = await usersRepository.save(
        id,
        name, 
        email,
        encrypted
      );

      if(userCreated) return response.status(201).json({
          message: 'Registered successfully.',
      });
    
    } catch (error) {
      return response.status(500).json({ 
        error: 'Something went wrong. Please try again in a few minutes.',
      });
    }
  };
}

export default new UsersResources();