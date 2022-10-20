import pool from '../../config/database';
import { Collaborator } from '../domain/Collaborator';

class CollaboratorRepository {
  async findByEmail(emailCollaborator: string, managerId: string) {
    const client = await pool.connect();
    const sql = `
      SELECT * FROM collaborators WHERE email LIKE $1 AND manager_id LIKE $2`;
    const values = [ emailCollaborator, managerId ];
    const { rows } = await client.query(sql, values);
    const [{ id, name, email, password, manager_id }] = rows;
    
   return new Collaborator(id, name, email, password, manager_id);
  }

  async checkIfCollaboratorExistsByEmail(email: string, managerId: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      SELECT email FROM collaborators 
      WHERE email LIKE $1 
      AND manager_id LIKE $2
    `;
    const values = [ email, managerId ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false;
  }

  async checkIfCollaboratorExistsById(id: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `SELECT id FROM collaborators WHERE id LIKE $1`;
    const values = [ id ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false;
  }

  async save(id: string, name: string, email: string, password: string, managerId: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      INSERT INTO collaborators 
        (id, name, email, password, manager_id) 
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [ id, name, email, password, managerId ];

    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false;
  }

  async findAll(managerId: string): Promise<Collaborator[]> {
    const client = await pool.connect();
    const sql = `SELECT * FROM collaborators WHERE manager_id LIKE $1`;
    const values = [ managerId ];
    const { rows } = await client.query(sql, values);

    return rows.map(collaborator => {
      const { id, name, email, password, manager_id } = collaborator;
      return new Collaborator(id, name, email, password, manager_id);
    });
  }
}

export default new CollaboratorRepository();