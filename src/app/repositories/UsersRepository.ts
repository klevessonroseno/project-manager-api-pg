import pool from '../../config/database';
import { User } from '../domain/User';

class UsersRepository {
  async save(id: string, name: string, email: string, password: string): Promise<boolean> { 
    const client = await pool.connect();
    const sql = `         
      INSERT INTO
        users 
          (id, name, email, password)
        VALUES
          ($1, $2, $3, $4)
    `;
    const values = [ id, name, email, password ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount && rowCount !== 0) return true;

    return false;
  }

  async update(user: User): Promise<boolean> {

    const id = user.getId();
    const name = user.getName();
    const email = user.getEmail();
    const password = user.getPassword();

    const client = await pool.connect();
    const values = [ name, email, password, id ];

    const sql = `
      UPDATE
        users
      SET
        name = $1,
        email = $2,
        password = $3
      WHERE 
        id LIKE $4
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

  async findByEmail(userEmail: string): Promise<User> {
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
    const { rows } = await client.query(sql, values);
    const [{ id, name, email, password }] = rows;
    
    return new User(id, name, email, password);
  }

  async findById(userId: string): Promise<User> {
    const client = await pool.connect();
    const sql = `
      SELECT
        id "id",
        name "name",
        email "email",
        password "password"
      FROM 
        users
      WHERE
        id 
      LIKE 
        $1
    `;
    const values = [ userId ];
    const { rows } = await client.query(sql, values);

    const [{ id, name, email, password }] = rows;

    return new User(id, name, email, password);
  }
}

export default new UsersRepository();