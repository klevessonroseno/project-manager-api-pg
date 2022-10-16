import server from './app';
import 'dotenv/config';

const port = process.env.SERVER_PORT;
const host = process.env.SERVER_HOST;

server.listen(port, () => console.log(`App is running at ${host}:${port}`));