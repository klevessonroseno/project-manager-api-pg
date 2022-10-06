import connect from '../../config/database';
import { Collaborator } from '../domain/Collaborator';

class CollaboratorRepository {
  async store(name, email, password) {
    const pgClient = await connect();
    const sql = `
      INSERT INTO 
        collaborators 
        (name, email, password) 
      VALUES 
        ($1, $2, $3)
    `;
    const values = [ name, email, password ];
    const result = await pgClient.query(sql, values);

    return result;
  }
}

export default new CollaboratorRepository();