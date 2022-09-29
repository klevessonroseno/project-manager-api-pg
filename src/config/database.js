require('dotenv').config();
const pg = require('pg');

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

module.exports = new Database().connect;