import pool from '../../config/database';
import { Tasks } from '../domain/Tasks';

class TasksRepository {
  async save(
    id: string, 
    title: string, 
    description: string, 
    deadline: Date, 
    createdAt: Date, 
    updatedAt: Date, 
    finished: boolean, 
    userId: string,
    projectId: string,
  ): Promise<boolean> {  
    const client = await pool.connect();
    const sql = `
      INSERT INTO 
        tasks
      (
        id, 
        title, 
        description, 
        deadline, 
        created_at, 
        updated_at, 
        finished, 
        user_id,
        project_id
      ) 
        VALUES 
      (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
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
      userId,
      projectId,
    ];

    const { rowCount } = await client.query(sql, values);

    if(rowCount) return true;

    return false;
  }

  async find(userId: string, projectId: string) {
    const client = await pool.connect();
    const values = [ userId, projectId ];
    
    const sql = `
      SELECT * FROM tasks 
      WHERE user_id LIKE $1 
      AND project_id LIKE $2`;

    const { rows } = await client.query(sql, values);

    return rows;
  } 
}

export default new TasksRepository();