import { Request, Response } from 'express';
import usersRepository from '../repositories/UsersRepository';
import * as Yup from 'yup';
import { generateId } from '../helpers/generateId';
import { encryptPassword } from '../helpers/encryptPassword';
import { generatePassword } from '../helpers/generatePassword';
import { EmailSender } from '../services/email/EmailSender';
import { compare } from 'bcrypt';

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
      
      if(!schemaIsValid || request.body.id) {
        return response.status(400).json({
          error: 'Bad Request.',
        });  
      }  

      if(!request.id || typeof request.id !== 'string') {
        return response.status(400).json({
          error: 'Bad Request.',        
        });
      }
      
      const { id } = request;
      const idExists = await usersRepository.idExists(id);

      if(!idExists) return response.status(401).json({
        error: 'Unauthorized.',        
      });

      const user = await usersRepository.getById(id);
      
      if(request.body.email) {
        const { email }: { email: string } = request.body;

        if(email !== user.getEmail()) {
          const emailExists = await usersRepository.emailExists(email);

          if(emailExists) return response.status(409).json({
              error: 'Email already registered.',
          });
        }
      }

      if(request.body.oldPassword) {
        const { oldPassword }: { oldPassword: string } = request.body;
        const password = user.getPassword();
        const passwordsMatch = await compare(oldPassword, password);
  
        if(!passwordsMatch) return response.status(401).json({
            error: 'Old password does not match entered password.',
        });
      }
  
      if(request.body.password) {
        const { password }: { password: string } = request.body;
        request.body.password = await encryptPassword(password);
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
        email: Yup.string().email().required().max(200),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) return response.status(400).json({
          error: 'Validation failed.',
      });

      const { email }: { email: string } = request.body;

      const emailExists = await usersRepository.emailExists(email);
      
      if(!emailExists) return response.status(404).json({
        error: 'Email not registered.',
      });

      const user = await usersRepository.getByEmail(email);
      const newPassword = generatePassword();
      const newPasswordEncrypted = await encryptPassword(newPassword);

      user.setPassword(newPasswordEncrypted);

      const userUpdated = await usersRepository.update(user);

      if(userUpdated) {

        const [ firstName ] = user.getName().split(' ');
        
        const emailData = {
          email: user.getEmail(),
          title: 'Email atualizado',
          massage: `${ firstName }, sua nova senha é ${newPassword}`,
        }
       
        const emailSender = new EmailSender(
          emailData.email,
          emailData.title,
          emailData.massage,
        );

        emailSender.sendEmail();

        return response.status(200).json({
          message: 'Password successfully updated.',
        });
      }

    } catch (error) {
      console.log(error)
      return response.status(500).json({ error });
    }
  }
}

export default new UsersResources();