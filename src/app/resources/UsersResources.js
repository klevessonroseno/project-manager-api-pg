import usersRepository from "../repository/usersRepository";
import * as Yup from 'yup';
import usersServices from "../services/UsersServices";

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
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6).max(10),
      });

      if(!(await schema.isValid(request.body))) {
        return response.status(400).json({
          error: 'Validation fails.'
        });
      }

      const { name, email, password } = request.body;

      const userExists = await usersRepository.findByEmail(email);

      if(userExists) return response.status(409).json({
        error: 'E-mail already registered.',
      });
      
      const encryptPassword = await usersServices.encryptPassword(password);
      const userCreated = await usersRepository.store(name, email, encryptPassword);

      if(userCreated) return response.status(201).json({
        message: 'User registered successfully.',
      });

    } catch (error) {
      response.status(500).json({ error });
    }
  };
}

export default new UsersResources();