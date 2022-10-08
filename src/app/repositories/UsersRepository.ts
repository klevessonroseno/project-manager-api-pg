import connect from '../../config/database';
import { IUser } from '../rules/rules';

class UsersRepository {
  async store(name: string, email: string, password: string) {
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

  async update(user: IUser) {
    const { id, name, email, password } = user;
    const pgClient = await connect();
    const values = [ name, email, password, id ];
    const sql = `
      UPDATE
        users
      SET
        user_name = $1,
        user_email = $2,
        user_password = $3
      WHERE 
        user_id LIKE $4
    `;
    const result = await pgClient.query(sql, values);
    const { rowCount } = result;

    if(rowCount) return rowCount;
    
    return null;
  }

  async findByEmail(userEmail: string) {
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
        user_email 
      LIKE 
        $1
    `;
    const values = [ userEmail ];
    const { rowCount, rows } = await pgClient.query(sql, values);

    if(!rowCount) return null;

    const [{ id, name, email, password }] = rows;
    const user: IUser = {
      id,
      name,
      email,
      password,
    };

    return user;
  }

  async findByid(userId: string) {
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
        user_id = $1
    `;
    const values = [ userId ];
    const { rows } = await pgClient.query(sql, values);

    const [{ id, name, email, password }] = rows;

    const user: IUser = {
      id,
      name,
      email,
      password,
    };

    return user;
  }
}

export default new UsersRepository();