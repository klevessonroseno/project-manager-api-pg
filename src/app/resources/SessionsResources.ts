import * as Yup from 'yup';
import usersRepository from '../repositories/usersRepository';
import sessionsServices from '../services/SessionsServices';
import { Request, Response } from 'express';

class SessionsResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        email:  Yup.string().email().required(),
        password: Yup.string().required(),
      });

      if(!(await schema.isValid(request.body))) {
        return response.status(400).json({
          error: 'Validation fails.',
        });
      }

      const { email, password } = request.body;
      const user = await usersRepository.findByEmail(email);

      if(!user) {
        return response.status(404).json({
          error: 'Email not registered.',
        });
      }

      const passwordsMatch = await sessionsServices.comparePasswords(password, user.password);

      if(!passwordsMatch) {
        return response.status(401).json({
          error: 'Incorrect password.',
        }); 
      }

      const token = sessionsServices.generateJwtToken(user);

      return response.status(200).json({ token });

    } catch (error) {
      response.status(500).json();
    }
  }
}

export default new SessionsResources();