import collaboratorsRepository from '../repositories/CollaboratorsRepository';
import { Request, Response } from 'express';
import collaboratorsServices from '../services/CollaboratorsServices';
import { EmailSender } from '../services/email/EmailSender';
import * as Yup from 'yup';

class CollaboratorsResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required().max(200),
        email: Yup.string().email().required().max(200),
      });  
  
      const schemaIsValid = await schema.isValid(request.body);
  
      if(!schemaIsValid) return response.status(400).json({
        error: 'Bad Request.'
      });
  
      const { name, email }: { name: string, email: string } = request.body;
      const { id } = request;
  
      const collaboratorsFoundByEmail = await collaboratorsRepository
          .checkIfCollaboratorExistsByEmail(email);
      
      if(collaboratorsFoundByEmail) return response.status(409).json({
        error: 'Email already registered.',
      });
  
      const userId = collaboratorsServices.generateId();

      const collaboratorsFoundById = await collaboratorsRepository
        .checkIfCollaboratorExistsById(id, userId);

      if(collaboratorsFoundById) return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });

      const password = collaboratorsServices.generatePassword();
      
      const passwordEncrypted = await collaboratorsServices
        .encryptPassword(password);

      const collaboratorCreated = await collaboratorsRepository.save(
        id, 
        name, 
        email,
        passwordEncrypted, 
        userId
      );
  
      if(collaboratorCreated) {

        const collaborator = await collaboratorsRepository
          .findByEmail(email, userId);

        const [ collaboratorFirstName ] = collaborator.getName().split(' ');
        
        const emailData = {
          email: collaborator.getEmail(),
          title: 'Cadastro realizado!',
          massage: `${ collaboratorFirstName }, sua senha é ${password}.`,
        }
        
        const emailSender = new EmailSender(
          emailData.email,
          emailData.title,
          emailData.massage,
        );

        emailSender.sendEmail();

        return response.status(201).json({
          message: 'Registered successfully.',
        });
      }

    } catch (error) {
      return response.status(500).json({ 
        error: 'Something went wrong. Please try again in a few minutes.',
      });
    }
  }

  async find(request: Request, response: Response) {
    try {
      const userId = request.id;
    
      const collaboratorsExists = await collaboratorsRepository
        .checkIfCollaboratorsExists(userId);
    
      if(!collaboratorsExists) return response.status(404).json({
        error: 'No collaborator registered.',
      });

      const collaborators = await collaboratorsRepository.findAll(userId);

      const data = collaborators.map(collaborator => {

        const id = collaborator.getId();
        const name = collaborator.getName();
        const email = collaborator.getEmail();

        return ({ id, name, email });

      });

      return response.status(200).json(data);

    } catch (error) {
      return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        id: Yup.string().required(),
        name: Yup.string().max(200),
        email: Yup.string().email().max(200)
      });
     
      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) return response.status(400).json({
        error: 'Bad Request.',
      });

      const { id }: { id: string } = request.body;
      const userId = request.id;
      
      if(typeof id !== 'string') {
        return response.status(400).json({
          error: 'Bad Request.',
        });
      }

      const collaboratorsFoundById = await collaboratorsRepository
        .checkIfCollaboratorExistsById(id, userId);

      if(!collaboratorsFoundById) return response.status(404).json({
        error: 'Collaborator not found.',
      });

      const collaborator = await collaboratorsRepository
        .findById(id, userId);

      if(request.body.email) {
        const { email }: { email: string } = request.body;

        if(email !== collaborator.getEmail()) {
          const collaboratorsFoundByEmail = await collaboratorsRepository
            .checkIfCollaboratorExistsByEmail(email);
          
          if(collaboratorsFoundByEmail) {
            return response.status(409).json({
              error: 'Email already registered.',
            });  
          }        
        }
      }

      Object.assign(collaborator, request.body);     

      const collaboratorUpdated = await collaboratorsRepository
        .update(collaborator, userId);
      
      if(collaboratorUpdated) return response.status(204).json({});

    } catch (error) {
      return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        id: Yup.string().required(),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if(!schemaIsValid) return response.status(400).json({
        error: 'Bad Request.',
      });

      const { id }: { id: string } = request.body;
      const userId = request.id;

      if(typeof id !== 'string') return response.status(400).json({
        error: 'Bad Request',
      });

      const collaboratorsFoundById = await collaboratorsRepository
        .checkIfCollaboratorExistsById(id, userId);

      if(!collaboratorsFoundById) return response.status(404).json({
        error: 'Collaborator not found',
      });

      const collaboratorDeleted = await collaboratorsRepository
        .delete(id, userId);

      if(collaboratorDeleted) return response.status(204).json({});

    } catch (error) {
      return response.status(500).json({ 
        error: 'Something went wrong. Please try again in a few minutes.',
      });
    }
  }
}

export default new CollaboratorsResources();