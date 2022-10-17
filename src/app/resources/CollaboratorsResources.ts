import collaboratorsRepository from '../repositories/CollaboratorsRepository';
import { Request, Response } from 'express';
import collaboratorsServices from '../services/CollaboratorsServices';

class CollaboratorsResources {
  async store(request: Request, response: Response) {
    const managerId = request.manager.id;
    const { name, email, password } = request.body;
    const id = collaboratorsServices.generateId();
    const result = await collaboratorsRepository.save(id, name, email, password, managerId);

    return response.json({ result });
  }

  async find(request: Request, response: Response) {
    const managerId = request.manager.id;
    const collaborators = await collaboratorsRepository.findAll(managerId);
    return response.status(200).json(collaborators);
  }
}

export default new CollaboratorsResources();