import { config } from 'dotenv';
import pg from 'pg';

config();

class Database {
  async connect() {
    if (global.connection) return global.connection.connect();
  
    const { Pool } = pg;
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });
  
    global.connection = pool;
    
    return pool.connect();
  }
}

export default new Database().connect;