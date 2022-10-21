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
      const { managerId } = request;
  
      const collaboratorsFoundByEmail = await collaboratorsRepository
          .checkIfCollaboratorExistsByEmail(email, managerId);
      
      if(collaboratorsFoundByEmail) return response.status(409).json({
        error: 'Email already registered.',
      });
  
      const id = collaboratorsServices.generateId();

      const collaboratorsFoundById = await collaboratorsRepository
        .checkIfCollaboratorExistsById(id);

      if(collaboratorsFoundById) return response.status(500).json({
        error: 'Something went wrong. Please try again in a few minutes.',
      });

      const password = collaboratorsServices.generatePassword();
      const collaboratorCreated = await collaboratorsRepository.save(
        id, 
        name, 
        email,
        password, 
        managerId
      );
  
      if(collaboratorCreated) {
        const collaborator = await collaboratorsRepository
          .findByEmail(email, managerId);
        
        const collaboratorEmail = collaborator.getEmail();
        const [ collaboratorFirstName ] = collaborator.getName().split(' ');

        const emailSender = new EmailSender(
          collaboratorEmail,
          'Cadastro Realizado.',
          `${collaboratorFirstName}, a sua senha é ${password}.`
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
    const managerId = request.managerId;
    
    const collaboratorsExists = await collaboratorsRepository
      .checkIfCollaboratorsExists(managerId);
    
    if(!collaboratorsExists) return response.status(404).json({
      error: 'No collaborator registered.',
    });

    const collaborators = await collaboratorsRepository.findAll(managerId);

    const data = collaborators.map(collaborator => {

      const id = collaborator.getId();
      const name = collaborator.getName();
      const email = collaborator.getEmail();

      return ({ id, name, email });

    });

    return response.status(200).json(data);
  }
}

export default new CollaboratorsResources();