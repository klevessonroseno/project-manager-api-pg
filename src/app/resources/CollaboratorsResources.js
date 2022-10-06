import collaboratorRepository from '../repository/CollaboratorRepository';

class CollaboratorsResources {
  async store(request, response) {
    const { userId } = request;
    const { name, email, password } = request.body;

    const result = await collaboratorRepository.store(name, email, password, userId);

    return response.json({ result });
  }
}

export default new CollaboratorsResources();