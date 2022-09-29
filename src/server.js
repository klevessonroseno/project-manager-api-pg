const server = require('./app');

const port = 8080;
server.listen(port, () => console.log(`App is running at port ${port}`));