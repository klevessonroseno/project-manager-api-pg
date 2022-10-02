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

  async findByEmail(email) {
    const pgClient = await connect();
    const sql = `
      SELECT
        user_id,
        user_name,
        user_email,
        user_password
      FROM 
        users
      WHERE
        user_email 
      LIKE 
        $1
    `;
  
    const values = [ email ];

    const { 
      rowCount, 
      rows: [ 
        { 
          user_id, 
          user_name, 
          user_email, 
          user_password 
        } 
      ] 
    } = await pgClient.query(sql, values);

    const user = new User(
      user_id, 
      user_name, 
      user_email, 
      user_password
    );

    if(rowCount) return user;

    return null;
  }
}

export default new UsersRepository();