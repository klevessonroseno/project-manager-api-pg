import pool from '../../config/database';
import { User } from '../domain/User';

type data = [{ 
  id: string, 
  name: string, 
  email: string, 
  password: string,  
}];

class UsersRepository {
  async saveManager(

    id: string, 
    name: string, 
    email: string, 
    password: string,
    isManager: boolean
    
  ): Promise<boolean> {
    const client = await pool.connect();
    const sql = `         
      INSERT INTO users 
        (id, name, email, password, ismanager)
      VALUES
        ($1, $2, $3, $4, $5)
    `;
    const values = [ id, name, email, password, isManager ];
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

  async isManager(email: string): Promise<boolean> {
    const client = await pool.connect();
    const values = [ email ];
    const sql = `SELECT ismanager "isManager" FROM users WHERE email LIKE $1`;
    const { rows } = await client.query(sql, values);

    type data = [{ isManager: boolean }]

    const [{ isManager }] = rows as data;
    
    return isManager;
  }
}

export default new UsersRepository();