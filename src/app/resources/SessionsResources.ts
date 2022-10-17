import * as Yup from 'yup';
import managersRepository from '../repositories/ManagersRepository';
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
      const managerFoundByEmail = await managersRepository.checkIfManagerExistsByEmail(email);

      if(!managerFoundByEmail) return response.status(401).json({
          error: 'Invalid email or password.',
      });

      const manager = await managersRepository.findByEmail(email);
      const passwordsMatch = await sessionsServices.comparePasswords(password, manager.getPassword());

      if(!passwordsMatch) return response.status(401).json({
          error: 'Invalid email or password.',
      }); 
      
      const token = sessionsServices.generateManagerJwtToken(manager);
      return response.status(200).json({ token });

    } catch (error) {
      return response.status(500).json({
        error: 'Validation failed.',
      });
    }
  }
}

export default new SessionsResources();