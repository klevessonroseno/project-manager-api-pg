import pool from '../../config/database';
import { User } from '../domain/User';
import { IUser } from '../rules/rules';

class UsersRepository {
  async save(user: User): Promise<boolean> {

    const id = user.getId();
    const name = user.getName();
    const email = user.getEmail();
    const password = user.getPassword(); 
    
    const client = await pool.connect();
    const sql = `         
      INSERT INTO
        users_teste 
          (
            user_id,
            user_name, 
            user_email, 
            user_password
          )
        VALUES
          ($1, $2, $3, $4)
    `;
    const values = [ id, name, email, password ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false;
  }

  async update(user: IUser): Promise<boolean> {
    const { id, name, email, password } = user;
    const client = await pool.connect();
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
    const { rowCount } = await client.query(sql, values);

    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false;
  }

  async checkIfUserExistsByEmail(email: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `
      SELECT 
        user_email 
      FROM 
        users
      WHERE
        user_email 
      LIKE 
        $1
    `;
    const values = [ email ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false; 
  }

  async findByEmail(userEmail: string): Promise<IUser> {
    const client = await pool.connect();
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
    const { rowCount, rows } = await client.query(sql, values);
    const user: IUser = {};

    if(!rowCount) return user;

    const [{ id, name, email, password }] = rows;
    
    user.id = id;
    user.name = name;
    user.email = email;
    user.password = password;

    return user;
  }

  async findByid(userId: string): Promise<IUser> {
    const client = await pool.connect();
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
    const { rowCount, rows } = await client.query(sql, values);
    const user: IUser = {};

    if(!rowCount) return user;

    const [{ id, name, email, password }] = rows;
    
    user.id = id;
    user.name = name;
    user.email = email;
    user.password = password;

    return user;
  }
}

export default new UsersRepository();