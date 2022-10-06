import connect from '../../config/database';
import { Collaborator } from '../domain/Collaborator';

class CollaboratorRepository {
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
    const result = await pgClient.query(sql, values);

    return result;
  }
}

export default new CollaboratorRepository();