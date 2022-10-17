import collaboratorRepository from '../repositories/CollaboratorRepository';
import { Request, Response } from 'express';
import collaboratorsServices from '../services/CollaboratorsServices';

class CollaboratorsResources {
  async store(request: Request, response: Response) {
    const userId = request.user.id;
    const { name, email, password } = request.body;
    const id = collaboratorsServices.generateId();
    const result = await collaboratorRepository.save(id, name, email, password, userId);

    return response.json({ result });
  }

  async find(request: Request, response: Response) {
    const userId = request.user.id;
    const collaborators = await collaboratorRepository.findAll(userId);
    return response.status(200).json(collaborators);
  }
}

export default new CollaboratorsResources();