import * as Yup from 'yup';
import usersRepository from '../repositories/UsersRepository';
import sessionsServices from '../services/SessionsServices';
import { Request, Response } from 'express';

class SessionsResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        email:  Yup.string().email().required().max(200),
        password: Yup.string().required().min(6).max(10),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) return response.status(400).json({
          error: 'Validation failed.',
      });

      const { email, password } = request.body;
      const userFoundByEmail = await usersRepository.checkIfUserExistsByEmail(email);

      if(!userFoundByEmail) return response.status(401).json({
          error: 'Invalid email or password.',
      });

      const user = await usersRepository.findByEmail(email);
      const passwordsMatch = await sessionsServices.comparePasswords(password, user.getPassword());

      if(!passwordsMatch) return response.status(401).json({
          error: 'Invalid email or password.',
      }); 
      
      const token = sessionsServices.generateUserJwtToken(user);
      return response.status(200).json({ token });

    } catch (error) {
      return response.status(500).json({
        error: 'Validation failed.',
      });
    }
  }
}

export default new SessionsResources();