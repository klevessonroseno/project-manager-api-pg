import collaboratorRepository from '../repository/CollaboratorRepository';
import { Request, Response } from 'express';

class CollaboratorsResources {
  async store(request: Request, response: Response) {
    const { userId } = request;
    const { name, email, password } = request.body;

    const result = await collaboratorRepository.store(name, email, password, userId);

    return response.json({ result });
  }
}

export default new CollaboratorsResources();