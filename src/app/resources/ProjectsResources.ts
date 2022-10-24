import { Request, Response } from 'express';
import projectsRepository from '../repositories/ProjectsRepository';
import * as Yup from 'yup';
import { generateId } from '../helpers/generateId';

class ProjectsResources {
  async store(request: Request, response: Response) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required().max(200),
        description: Yup.string().required().max(500),
        deadline: Yup.date().required(),
      });

      const schemaIsValid = await schema.isValid(request.body);

      if (!schemaIsValid) {
        return response.status(400).json({
          error: 'Bad Request.',
        });
      }

      const {
        id = generateId(),
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

      const userId = request.id;

      const projectCreated = await projectsRepository.save(
        id,
        title,
        description,
        deadline,
        createdAt,
        updatedAt,
        finished,
        userId
      );

      if (projectCreated) return response.status(201).json({
        message: 'Project created successfully.'
      });

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'Something went wrong.',
      });
    }
  }

  async find(request: Request, response: Response) {
    try {
      const { id } = request;
      const data = await projectsRepository.find(id);
      return response.status(200).json({ data });
    } catch (error) {
      return response.status(500).json({
        error: 'Something went wrong.'
      });
    }
  }
}

export default new ProjectsResources();
