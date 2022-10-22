import pool from '../../config/database';
import { Manager } from '../domain/Manager';

type data = [{ 
  id: string, 
  name: string, 
  email: string, 
  password: string,  
}];

class ManagersRepository {
  async save(

    id: string, 
    name: string, 
    email: string, 
    password: string
    
  ): Promise<boolean> {
    const client = await pool.connect();
    const sql = `         
      INSERT INTO managers 
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

  async update(manager: Manager): Promise<boolean> {
    const id = manager.getId();
    const name = manager.getName();
    const email = manager.getEmail();
    const password = manager.getPassword();

    const client = await pool.connect();
    const values = [ name, email, password, id ];

    const sql = `
      UPDATE managers 
      SET name = $1, email = $2, password = $3 
      WHERE id LIKE $4
    `;
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async checkIfManagerExistsByEmail(email: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `SELECT email FROM managers WHERE email LIKE $1`;
    const values = [ email ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async checkIfManagerExistsById(id: string): Promise<boolean> {
    const client = await pool.connect();
    const sql = `SELECT id FROM managers WHERE id LIKE $1`;
    const values = [ id ];
    const { rowCount } = await client.query(sql, values);
    
    client.release();

    if(rowCount) return true;

    return false;
  }

  async findByEmail(managerEmail: string): Promise<Manager> {

    const client = await pool.connect();

    const sql = `SELECT * FROM managers WHERE email LIKE $1`;

    const values = [ managerEmail ];
    
    const { rows } = await client.query(sql, values);
    const [{ id, name, email, password }] = rows as data;
    
    client.release();

    return new Manager(id, name, email, password);
  }

  async findById(managerId: string): Promise<Manager> {
    const client = await pool.connect();
    const sql = `SELECT * FROM managers WHERE id LIKE $1`;
    const values = [ managerId ];
    const { rows } = await client.query(sql, values);

    const [{ id, name, email, password }] = rows as data;

    client.release();

    return new Manager(id, name, email, password);
  }
}

export default new ManagersRepository();