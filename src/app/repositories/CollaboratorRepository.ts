import pool from '../../config/database';
import { Collaborator } from '../domain/Collaborator';

class CollaboratorRepository {
  async findByEmail(emailCollaborator: string, userId: string) {
    const client = await pool.connect();
    const sql = `SELECT * FROM collaborators WHERE email LIKE $1 AND user_id LIKE $2`;
    const values = [ emailCollaborator, userId ];
    const { rows } = await client.query(sql, values);
    const [{ id, name, email, password, user_id }] = rows;
    
   return new Collaborator(id, name, email, password, user_id);
  }

  async save(id: string, name: string, email: string, password: string, userId: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      INSERT INTO collaborators 
        (id, name, email, password, user_id) 
      VALUES ($1, $2, $3, $4)
    `;
    const values = [ id, name, email, password, userId ];

    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false;
  }
}

export default new CollaboratorRepository();