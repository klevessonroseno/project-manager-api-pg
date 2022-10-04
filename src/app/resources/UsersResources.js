import usersRepository from "../repository/usersRepository";
import * as Yup from 'yup';
import usersServices from "../services/UsersServices";

class UsersResources {
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

  async update(request, response) {
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
        error: 'Validation Fails.',
      });
    }

    const { userId } = request;
    const user = await usersRepository.findByid(userId);
    const result = await usersRepository.update(user);
    response.status(200).json({ result });
  }
}

export default new UsersResources();