import { Project } from '../domain/Project';
import { Task } from '../domain/Task';
import pool from '../../config/database';

export class ProjectsRepository {
  static async save(
    id: string,
    title: string,
    description: string,
    deadline: Date,
    createdAt: Date,
    updatedAt: Date,
    finished: boolean,
    managerId: string,
  ): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      INSERT INTO 
        projects
      (
        id, 
        title, 
        description, 
        deadline, 
        created_at, 
        updated_at, 
        finished, 
        user_id
      ) 
        VALUES 
      (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
    `;
    const values = [
      id,
      title,
      description,
      deadline,
      createdAt,
      updatedAt,
      finished,
      managerId,
    ];

    const { rowCount } = await client.query(sql, values);

    if (rowCount) return true;

    return false;
  }

  private static async getTasks(
    userID: string,
    projectID: string
  ): Promise<Task[]> {
    const client = await pool.connect();
    const values = [userID, projectID];

    const sql = `
      SELECT
        id, 
        title, 
        description, 
        deadline, 
        created_at "createdAt",
        updated_at "updatedAt",
        finished,
        user_id "userId",
        project_id "projectId"
      FROM 
        tasks 
      WHERE 
        user_id LIKE $1 
      AND 
        project_id LIKE $2
    `;

    const { rows } = await client.query(sql, values);

    type data = {
      id: string,
      title: string,
      description: string,
      deadline: Date,
      createdAt: Date,
      updatedAt: Date,
      finished: boolean,
      userId: string,
      projectId: string,
    };

    const tasks: Task[] = rows.map((task: data) => {
      return new Task(
        task.id,
        task.title,
        task.description,
        task.deadline,
        task.createdAt,
        task.updatedAt,
        task.finished,
        task.userId,
        task.projectId,
      );
    });

    return tasks;
  }

  static async getProjectById(
    userID: string,
    projectID: string
  ): Promise<Project> {
    const client = await pool.connect();
    const values = [userID, projectID];

    const sql = `
      SELECT
        id, 
        title, 
        description, 
        deadline, 
        created_at "createdAt",
        updated_at "updatedAt",
        finished,
        user_id "userId"
      FROM 
        projects 
      WHERE 
        user_id LIKE $1
      AND
        id LIKE $2
    `;

    const { rows } = await client.query(sql, values);

    type data = [{
      id: string,
      title: string,
      description: string,
      deadline: Date,
      createdAt: Date,
      updatedAt: Date,
      finished: boolean,
      userId: string,
    }];

    const [{
      id,
      title,
      description,
      deadline,
      createdAt,
      updatedAt,
      finished,
      userId,
    }] = rows as data;

    const project = new Project(
      id,
      title,
      description,
      deadline,
      createdAt,
      updatedAt,
      finished,
      userId,
    );

    const tasks = await this.getTasks(
      project.getUserId(),
      project.getId()
    );

    project.setTasks(tasks);
     
    return project;
  }

  static async find(userID: string): Promise<Project[]> {
    const client = await pool.connect();
    const values = [userID];

    const sql = `
      SELECT
        id, 
        title, 
        description, 
        deadline, 
        created_at "createdAt",
        updated_at "updatedAt",
        finished,
        user_id "userId"
      FROM projects 
      WHERE user_id LIKE $1
    `;

    const { rows } = await client.query(sql, values);

    type data = {
      id: string,
      title: string,
      description: string,
      deadline: Date,
      createdAt: Date,
      updatedAt: Date,
      finished: boolean,
      userId: string,
    };

    const projects: Project[] = rows.map((project: data) => {
      return new Project(
        project.id,
        project.title,
        project.description,
        project.deadline,
        project.createdAt,
        project.updatedAt,
        project.finished,
        project.userId,
      );
    });

    return projects;
  }
}
