import { Request, Response } from 'express';
import projectsRepository from '../repositories/ProjectsRepository';
import * as Yup from 'yup';
import { v4 as uuiv4 } from 'uuid';

class ProjectsResources {
  async store(request: Request, response: Response) {
    try {
      const {
        id = uuiv4(), 
        title, 
        description, 
        deadline, 
        createdAt = new Date(), 
        updatedAt = new Date(), 
        finished = false, 
      }: {
        id: string, 
        title: string, 
        description: string, 
        deadline: Date, 
        createdAt: Date, 
        updatedAt: Date, 
        finished: boolean,
      } = request.body;

      const { managerId } = request;

      const projectCreated = await projectsRepository.save(
          id, 
          title, 
          description, 
          deadline, 
          createdAt, 
          updatedAt, 
          finished, 
          managerId
      );

      if(projectCreated) return response.status(201).json({
        message: 'Project created successfully.'
      });

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'Something went wrong.',
      });
    }
  }
}

export default new ProjectsResources();
