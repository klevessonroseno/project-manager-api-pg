import connect from '../../config/database';
import { Collaborator } from '../domain/Collaborator';

class CollaboratorRepository {
  async findByEmail(email) {
    const pgClient = await connect();
    const sql = `
      SELECT * FROM 
        collaborators 
      WHERE 
        email = $1;
    `;
    const values = [ email ];
    const result = await pgClient.query(sql, values);
    const { rowCount, rows } = result;
    
    if(!rowCount) return null;

    return rows;
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