import pool from '../../config/database';
import { User } from '../domain/User';

type data = [{ 
  id: string, 
  name: string, 
  email: string, 
  password: string,  
  isManager: boolean,
}];

class UsersRepository {
  async save(

    id: string, 
    name: string, 
    email: string, 
    password: string,
    
  ): Promise<boolean> {
    const client = await pool.connect();
    const sql = `         
      INSERT INTO users 
        (id, name, email, password)
      VALUES
        ($1, $2, $3, $4)
    `;
    const values = [ id, name, email, password ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async isRegistered(email: string): Promise<boolean> {
    const client = await pool.connect();
    const values = [ email ];
    const sql = `SELECT email FROM users WHERE email LIKE $1`;
    const { rowCount } = await client.query(sql, values);

    if(rowCount) return true;

    return false;
  }

  async isManager(id: string): Promise<boolean> {
    const client = await pool.connect();
    const values = [ id ];
    const sql = `SELECT ismanager "isManager" FROM users WHERE id LIKE $1`;
    const { rows, rowCount } = await client.query(sql, values);

    if(!rowCount) return false;

    type data = [{ isManager: boolean }];

    const [{ isManager }] = rows as data;
    
    return isManager;
  }

  async emailExists(email: string): Promise<boolean> {
    const client = await pool.connect();
    const values = [ email ];
    const sql = `SELECT email FROM users WHERE email LIKE $1`;
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async idExists(id: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `SELECT id FROM users WHERE id LIKE $1`;
    const values = [ id ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async getByEmail(userEmail: string): Promise<User> {
    const client = await pool.connect();
    const values = [ userEmail ];
    const sql = `
      SELECT  
        id, 
        name, 
        email, 
        password, 
        ismanager "isManager"
      FROM 
        users 
      WHERE email LIKE $1`;
    
    const { rows } = await client.query(sql, values);
    const [{ id, name, email, password, isManager }] = rows as data;
    
    client.release();

    return new User(id, name, email, password, isManager);
  }

  async getById(userId: string): Promise<User> {
    const client = await pool.connect();
    const values = [ userId ];
    const sql = `
      SELECT  
        id, 
        name, 
        email, 
        password, 
        ismanager "isManager"
      FROM 
        users 
      WHERE id LIKE $1`;
    
    const { rows } = await client.query(sql, values);
    const [{ id, name, email, password, isManager }] = rows as data;
    
    client.release();

    return new User(id, name, email, password, isManager);
  }

  async update(user: User): Promise<boolean> {
    
    const client = await pool.connect();

    const id = user.getId();
    const name = user.getName();
    const email = user.getEmail();
    const password = user.getPassword();
    
    const values = [ name, email, password, id ];

    const sql = `
      UPDATE 
        users 
      SET 
        name = $1, email = $2, password = $3 
      WHERE 
        id LIKE $4
    `;

    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }
}

export default new UsersRepository();