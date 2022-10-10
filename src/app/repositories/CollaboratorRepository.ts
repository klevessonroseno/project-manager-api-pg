import pool from '../../config/database';
import { ICollaborators } from '../rules/rules';

class CollaboratorRepository {
  async findByEmail(emailCollaborator: string, userId: string) {
    const client = await pool.connect();
    const sql = `
      SELECT 
        id "id",
        name "name",
        email "email",
        password "password",
        user_id "user_id"
      FROM 
        collaborators 
      WHERE 
        email LIKE $1
      AND
        user_id LIKE $2
    `;
    const values = [ emailCollaborator, userId ];
    const { rowCount, rows } = await client.query(sql, values);
    const collaborator: ICollaborators = {};

    if(!rowCount) return collaborator;

    const [{ id, name, email, password }] = rows;
    
    collaborator.id = id;
    collaborator.name = name;
    collaborator.email = email;
    collaborator.password = password;
    collaborator.userId = userId;

    return collaborator;
  }

  async store(name: string, email: string, password: string, userId: string) {
    const pgClient = await pool.connect();
    const sql = `
      INSERT INTO 
        collaborators 
        (name, email, password, user_id) 
      VALUES 
        ($1, $2, $3, $4)
    `;
    const values = [ name, email, password, userId ];

    const { rowCount } = await pgClient.query(sql, values);

    return rowCount;
  }
}

export default new CollaboratorRepository();