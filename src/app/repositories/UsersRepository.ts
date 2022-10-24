import pool from '../../config/database';
import { User } from '../domain/User';

type data = [{ 
  id: string, 
  name: string, 
  email: string, 
  password: string,  
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
        (id, name, email, password, ismanager)
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
    const sql = `SELECT email FROM users WHERE email LIKE $1`;
    const values = [ email ];
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
}

export default new UsersRepository();