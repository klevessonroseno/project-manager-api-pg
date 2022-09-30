import usersRepository from "../repository/usersRepository";

class UsersResources {
  async getAll(request, response) {
    try {
      const users = await usersRepository.getAll();

      response.status(200).json(users);
    } catch (error) {
      response.status(500).json(error) 
    }
  }

  async store(request, response) {
    try {
      const { name, email, password } = request.body;
      const userCreated = await usersRepository.store(name, email, password);

      response.status(201).json(userCreated);
    } catch (error) {
      response.status(500).json(error);
    }
  };
}

export default new UsersResources();