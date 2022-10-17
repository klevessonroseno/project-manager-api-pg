import usersRepository from "../repositories/UsersRepository";
import * as Yup from 'yup';
import usersServices from "../services/UsersServices";
import { Request, Response } from 'express';

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
          error: 'Validation failed.',
      });
      
      const { name, email, password } = request.body;
      const userFoundByEmail = await usersRepository.checkIfUserExistsByEmail(email);

      if(userFoundByEmail) return response.status(409).json({
        error: 'E-mail already registered.',
      });
      
      const id = usersServices.generateId();
      const userFoundById = await usersRepository.checkIfUserExistsById(id);

      if(userFoundById) return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });

      const encryptPassword = await usersServices.encryptPassword(password);

      const userCreated = await usersRepository.save(
        id,
        name, 
        email,
        encryptPassword
      );

      if(userCreated) return response.status(201).json({
          message: 'User registered successfully.',
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
  
      const userId = request.user.id;

      if(!userId) return response.status(400).json({
        error: 'Validation faild.',        
      });

      const userFoundById = await usersRepository.checkIfUserExistsById(userId);

      if(!userFoundById) return response.status(400).json({
        error: 'Validation faild.',        
      });

      const user = await usersRepository.findById(userId);
      
      if(request.body.email) {
        const { email } = request.body;

        if(email !== user.getEmail()) {
          const userFoundByEmail = await usersRepository.checkIfUserExistsByEmail(email);

          if(userFoundByEmail) return response.status(409).json({
              error: 'Email already registered by another user.',
          });
        }
      }

      if(request.body.oldPassword) {
        const { oldPassword } = request.body;
        const password = user.getPassword();
        const passwordsMatch = await usersServices.comparePasswords(oldPassword, password);
  
        if(!passwordsMatch) return response.status(401).json({
            error: 'Old password does not match the entered password.'
        });
      }
  
      if(request.body.password) {
        const { password } = request.body;
        request.body.password = await usersServices.encryptPassword(password);
      }
      
      Object.assign(user, request.body);
  
      const userUpdated = await usersRepository.update(user);
  
      if(userUpdated) return response.status(204).json();

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

export default new UsersResources();