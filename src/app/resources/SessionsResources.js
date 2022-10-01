import * as Yup from 'yup';
import usersRepository from '../repository/usersRepository';
import usersServices from '../services/UsersServices';


class SessionsResources {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        email:  Yup.string().email().required(),
        password: Yup.string().required(),
      });

      if(!(await schema.isValid(request.body))) {
        return response.status(400).json({
          error: 'Validation fails.',
        });
      }

      const { email, password } = request.body;
      const user = await usersRepository.findByEmail(email);

      if(!user) {
        return response.status(404).json({
          error: 'Email not registered.',
        });
      }

      const passwordsMatch = await usersServices.comparePasswords(password, user.password);

      if(!passwordsMatch) {
        return response.status(401).json({
          error: 'Incorrect password.',
        }); 
      }



      return response.status(200).json(user);

    } catch (error) {
      
    }
  }
}

export default new SessionsResources();