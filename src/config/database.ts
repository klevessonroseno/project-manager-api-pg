import { Pool } from 'pg';
import 'dotenv/config';

export default new Pool ({
    max: 20,
    connectionString: process.env.CONNECTION_STRING,
    idleTimeoutMillis: 30000,
});