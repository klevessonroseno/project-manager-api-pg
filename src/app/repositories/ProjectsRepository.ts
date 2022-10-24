import { Project } from '../domain/Project';
import pool from '../../config/database';

class ProjectsRepository {
  async save(
    id: string, 
    title: string, 
    description: string, 
    deadline: Date, 
    createdAt: Date, 
    updatedAt: Date, 
    finished: boolean, 
    managerId: string
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

    if(rowCount) return true;

    return false;
  }

  async find(userId: string) {
    const client = await pool.connect();
    const sql = `SELECT * FROM projects WHERE user_id LIKE $1`;
    const values = [ userId ];
    const { rows } = await client.query(sql, values);

    return rows;
  } 
}

export default new ProjectsRepository();
