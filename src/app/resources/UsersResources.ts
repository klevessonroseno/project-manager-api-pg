import usersRepository from "../repositories/UsersRepository";
import * as Yup from 'yup';
import usersServices from "../services/UsersServices";
import { Request, Response } from 'express';

class UsersResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6).max(10),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) {
        return response.status(400).json({
          error: 'Validation failed.',
        });
      }

      const { name, email, password } = request.body;
      const userExists = await usersRepository.checkIfUserExistsByEmail(email);

      if(userExists) return response.status(409).json({
        error: 'E-mail already registered.',
      });
      
      const id = usersServices.generateUserId();
      const encryptPassword = await usersServices.encryptPassword(password);

      const userCreated = await usersRepository.save(
        id,
        name, 
        email,
        encryptPassword
      );

      if(userCreated) {
        return response.status(201).json({
          message: 'User registered successfully.',
        });
      }
    } catch (error) {
      response.status(500).json({ 
        error: 'Something went wrong.',
      });
    }
  };

  async update(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6).max(10),
        password: Yup.string().min(6).max(10).when(
          'oldPassword', 
          (oldPassword, field) => { 
            return oldPassword 
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
      
      if(!schemaIsValid) {
        return response.status(400).json({
          error: 'Validation failed.',
        });
      }
  
      const { id } = request.body;
  
      if(id) return response.status(400).json({
        error: 'Validation failed.',
      });
  
      const { userId } = request;
      const user = await usersRepository.findById(userId);
      
      if(request.body.email) {
        let { email } = request.body;

        if(email !== user.getEmail()) {
          let userFound = await usersRepository.findByEmail(email);

          if(userFound) {
            return response.status(409).json({
              error: 'Email already registered by another user.',
            });
          }
        }
      }

      if(request.body.oldPassword) {
        let { oldPassword } = request.body;
        let password = user.getPassword();
        let passwordsMatch = await usersServices.comparePasswords(oldPassword, password);
  
        if(!passwordsMatch) {
          return response.status(401).json({
            error: 'Old password does not match the entered password.'
          });
        }
      }
  
      if(request.body.password) {
        let { password } = request.body;
        request.body.password = await usersServices.encryptPassword(password);
      }
      
      Object.assign(user, request.body);
  
      const userUpdated = await usersRepository.update(user);
  
      if(userUpdated) {
        return response.status(204).json();
      }
    } catch (error) {
      return response.status(500).json({ 
        error: 'Something went wrong.' 
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