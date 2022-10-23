import { Request, Response } from 'express';
import usersRepository from '../repositories/UsersRepository';

class UsersResources {
  async test(request: Request, response: Response) {
    return response.status(200).json({
      message: 'Okay!',
    });
  }

  async save(req: Request, res: Response) {
    const { id, name, email, password, isManager } = req.body;

    const userSaved = await usersRepository.saveManager(
      id,
      name,
      email,
      password,
      isManager
    );

    if(userSaved) return res.status(201).json({
      message: 'Created.'
    });

    return res.status(500).json();
  }
}

export default new UsersResources();