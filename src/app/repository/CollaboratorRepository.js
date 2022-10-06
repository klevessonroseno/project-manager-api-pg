import connect from '../../config/database';
import { Collaborator } from '../domain/Collaborator';

class CollaboratorRepository {
  async findByEmail(emailCollaborator, userId) {
    const pgClient = await connect();
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
        user_id = $2
    `;
    const values = [ emailCollaborator, userId ];
    const { rowCount, rows } = await pgClient.query(sql, values);

    if(!rowCount) return null;

    const { id, name, email, password, user_id } = rows;
    const collaborator = new Collaborator(id, name, email, password, user_id);

    return collaborator;
  }

  async store(name, email, password, userId) {
    const pgClient = await connect();
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