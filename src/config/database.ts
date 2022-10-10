import { Pool } from 'pg';
import { config } from 'dotenv';

config();

export default new Pool ({
    max: 20,
    connectionString: process.env.CONNECTION_STRING,
    idleTimeoutMillis: 30000
});