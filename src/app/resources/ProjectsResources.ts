import { Request, Response } from 'express';
import projectsRepository from '../repositories/ProjectsRepository';
import * as Yup from 'yup';

class ProjectsResources {
  async store(request: Request, response: Response) {
    try {
      const {
        id, 
        title, 
        description, 
        deadline, 
        createdAt, 
        updatedAt, 
        finished, 
        managerId,
      }: {
        id: string, 
        title: string, 
        description: string, 
        deadline: Date, 
        createdAt: Date, 
        updatedAt: Date, 
        finished: boolean, 
        managerId: string,
      } = request.body;

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
      return response.status(500).json({
        error: 'Something went wrong.',
      });
    }
  }
}

export default new ProjectsResources();
