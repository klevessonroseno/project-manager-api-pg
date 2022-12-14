import pool from '../../config/database';
import { Collaborator } from '../domain/Collaborator';

type data = [{ 
  id: string, 
  name: string, 
  email: string, 
  password: string, 
  manager_id: string; 
}];

class CollaboratorRepository {
  async findByEmail(
    emailCollaborator: string, 
    managerId: string
  ): Promise<Collaborator> {
    const client = await pool.connect();
    const sql = `
      SELECT * FROM 
        collaborators 
      WHERE email LIKE $1 
      AND manager_id LIKE $2
    `;
    const values = [ emailCollaborator, managerId ];
    const { rows } = await client.query(sql, values);
    const [{ id, name, email, password, manager_id }] = rows as data;
    
    return new Collaborator(id, name, email, password, true,  manager_id);
  }

  async checkIfCollaboratorExistsByEmail(
    email: string
  ): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      SELECT email FROM collaborators 
      WHERE email LIKE $1
    `;
    const values = [ email ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async checkIfCollaboratorExistsById(
    collaboratorId: string, 
    managerId: string
  ): Promise<boolean> {

    const client = await pool.connect();

    const sql = `
      SELECT id FROM 
        collaborators 
      WHERE id LIKE $1 
      AND manager_id LIKE $2
    `;

    const values = [ collaboratorId, managerId ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async save(
    id: string, 
    name: string, 
    email: string, 
    password: string, 
    managerId: string
  ): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      INSERT INTO collaborators 
        (id, name, email, password, manager_id) 
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [ id, name, email, password, managerId ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async checkIfCollaboratorsExists(managerId: string): Promise<boolean>{
    const client = await pool.connect();
    const sql = `SELECT * FROM collaborators WHERE manager_id LIKE $1`;
    const values = [ managerId ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();
    
    if(rowCount) return true;

    return false;
  }

  async findAll(managerId: string): Promise<Collaborator[]> {
    const client = await pool.connect();
    const sql = `SELECT * FROM collaborators WHERE manager_id LIKE $1`;
    const values = [ managerId ];
    const { rows } = await client.query(sql, values);

    return rows.map(collaborator => {
      
      const { id, name, email, password, manager_id } = collaborator as {
        id: string,
        name: string,
        email: string,
        password: string,
        manager_id: string,
      };

      return new Collaborator(id, name, email, password, true, manager_id);
    });
  }

  async findById(
    collaboratorId: string, 
    managerId: string
  ): Promise<Collaborator> {
    const client = await pool.connect();
    const sql = `
      SELECT * FROM 
        collaborators 
      WHERE id LIKE $1
      AND manager_id LIKE $2`
    ;
    const values = [ collaboratorId, managerId ];

    const { rows } = await client.query(sql, values); 

    const [{ id, name, email, password, manager_id }] = rows as data;

    return new Collaborator(id, name, email, password, false, manager_id);
  }

  async update(
    collaborator: Collaborator, 
    managerId: string
  ): Promise<boolean> {
    const id = collaborator.getId();
    const name = collaborator.getName();
    const email = collaborator.getEmail();

    const client = await pool.connect();
    const values = [ name, email, id, managerId ];

    const sql = `
      UPDATE collaborators 
      SET name = $1, email = $2 
      WHERE id LIKE $3
      AND manager_id LIKE $4
    `;
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async delete(collaboratorId: string, managerId: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      DELETE FROM collaborators 
      WHERE id LIKE $1 
      AND manager_id LIKE $2
    `;
    const values = [ collaboratorId, managerId ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }
}

export default new CollaboratorRepository();