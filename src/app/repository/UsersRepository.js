import connect from '../../config/database';
import { User } from '../domain/User';

class UsersRepository {
  async store(name, email, password) {
    const pgClient = await connect();
    const sql = `         
      INSERT INTO
        users 
          (
            user_name, 
            user_email, 
            user_password
          )
        VALUES
          ($1, $2, $3)
    `;
    const values = [ name, email, password ];
    const { rowCount } = await pgClient.query(sql, values);

    if(rowCount && rowCount > 0) return rowCount;

    return null;
  }

  async findByEmail(userEmail) {
    const pgClient = await connect();

    const sql = `
      SELECT
        user_id "id",
        user_name "name",
        user_email "email",
        user_password "password"
      FROM
        users
      WHERE
        user_email LIKE $1
    `;

    const values = [ userEmail ];
    
    const {
      rowCount, 
      rows: [
        { id, name, email, password },
      ],
    } = await pgClient.query(sql, values);
    
    const user = new User(id, name, email, password);

    if(rowCount) return user;

    return null;
  }

}

export default new UsersRepository();