import { Request, Response } from 'express';
import { ProjectsRepository } from '../repositories/ProjectsRepository';
import * as Yup from 'yup';
import { generateId } from '../helpers/generateId';
import { Project } from '../domain/Project';
import { Task } from '../domain/Task';
import { TasksRepository } from '../repositories/TasksRepository';

export class ProjectsResources {
  static async store(request: Request, response: Response) {
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

      const projectCreated = await ProjectsRepository.save(
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

  static async find(request: Request, response: Response) {
    try {
      const { id } = request;

      const projects = await ProjectsRepository.find(id);

      const tasks = await TasksRepository.find(
        projects[0].getUserId(),
        projects[0].getId()
      );

      projects[0].setTasks(tasks);
      
      const data = projects[0];
      
      console.log(data)

      response.json(data);

    } catch (error) {
      return response.status(500).json({
        error: 'Something went wrong.'
      });
    }
  }

  static async getByProjectId(request: Request, response: Response) {
    const { id } = request;
    const { projectId } = request.body;

    const project = await ProjectsRepository.getProjectById(id, projectId);

    return response.json(project);
  }
}
