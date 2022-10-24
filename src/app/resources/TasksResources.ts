import { Request, Response } from 'express';
import tasksRepository from '../repositories/TasksRepository';
import * as Yup from 'yup';
import { generateId } from '../helpers/generateId';

class TasksResources {
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
        projectId
      }: {
        id: string,
        title: string,
        description: string,
        deadline: Date,
        createdAt: Date,
        updatedAt: Date,
        finished: boolean,
        projectId: string,
      } = request.body;

      const userId = request.id;

      const taskCreated = await tasksRepository.save(
        id,
        title,
        description,
        deadline,
        createdAt,
        updatedAt,
        finished,
        userId,
        projectId
      );

      if (taskCreated) return response.status(201).json({
        message: 'Task created successfully.'
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
      const { projectId } = request.body;
      const data = await tasksRepository.find(id, projectId);
      return response.status(200).json({ data });
    } catch (error) {
      return response.status(500).json({
        error: 'Something went wrong.'
      });
    }
  }
}

export default new TasksResources();
