import * as Yup from 'yup';
import { Request, Response } from 'express';
import managersRepository from "../repositories/ManagersRepository";
import managersServices from "../services/ManagersServices";

class ManagersResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required().max(200),
        email: Yup.string().email().required().max(200),
        password: Yup.string().required().min(6).max(10),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) return response.status(400).json({
          error: 'Validation failed.',
      });
      
      const { name, email, password } = request.body;
      const managerFoundByEmail = await managersRepository.checkIfManagerExistsByEmail(email);

      if(managerFoundByEmail) return response.status(409).json({
        error: 'E-mail already registered.',
      });
      
      const id = managersServices.generateId();
      const managerFoundById = await managersRepository.checkIfManagerExistsById(id);

      if(managerFoundById) return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });

      const encryptPassword = await managersServices.encryptPassword(password);

      const managerCreated = await managersRepository.save(
        id,
        name, 
        email,
        encryptPassword
      );

      if(managerCreated) return response.status(201).json({
          message: 'Registered successfully.',
      });
    
    } catch (error) {
      response.status(500).json({ 
        error: 'Something went wrong. Please try again in a few minutes.',
      });
    }
  };

  async update(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        password: Yup.string().min(6).max(10),
        oldPassword: Yup.string().min(6).max(10).when(
          'password', 
          (password, field) => { 
            return password 
              ? field.required() 
              : field; 
          }
        ),
        confirmPassword: Yup.string().min(6).max(10).when(
          'password',
          (password, field) => {
            return password 
              ? field.required().oneOf([Yup.ref('password')]) 
              : field;
          }
        ),
      });
  
      const schemaIsValid = await schema.isValid(request.body);
      
      if(!schemaIsValid) return response.status(400).json({
          error: 'Validation failed.',
      });      
  
      const { id } = request.body;
  
      if(id) return response.status(400).json({
        error: 'Validation failed.',
      });
  
      const managerId = request.manager.id;

      if(!managerId) return response.status(400).json({
        error: 'Validation faild.',        
      });

      const managerFoundById = await managersRepository.checkIfManagerExistsById(managerId);

      if(!managerFoundById) return response.status(400).json({
        error: 'Validation faild.',        
      });

      const manager = await managersRepository.findById(managerId);
      
      if(request.body.email) {
        const { email } = request.body;

        if(email !== manager.getEmail()) {
          const managerFoundByEmail = await managersRepository.checkIfManagerExistsByEmail(email);

          if(managerFoundByEmail) return response.status(409).json({
              error: 'Email already registered by another Manager.',
          });
        }
      }

      if(request.body.oldPassword) {
        const { oldPassword } = request.body;
        const password = manager.getPassword();
        const passwordsMatch = await managersServices.comparePasswords(oldPassword, password);
  
        if(!passwordsMatch) return response.status(401).json({
            error: 'Old password does not match the entered password.'
        });
      }
  
      if(request.body.password) {
        const { password } = request.body;
        request.body.password = await managersServices.encryptPassword(password);
      }
      
      Object.assign(manager, request.body);
  
      const managerUpdated = await managersRepository.update(manager);
  
      if(managerUpdated) return response.status(204).json();

    } catch (error) {
      return response.status(500).json({ 
        error: 'Something went wrong. Please try again in a few minutes.' 
      });
    }
  }

  async resetPassword(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email(),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) {
        return response.status(400).json({
          error: 'Validation failed.',
        });
      }
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
}

export default new ManagersResources();