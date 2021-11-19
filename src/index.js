const app = require('./app');
const http = require('http');
const { jsonRPC } = require('./util');

async function main() {
    // process.env.CONFIG
    // verify envrionment is correct, rpc user pw url port
    // error if not
    // ping the node
    // error if the node doesn't respond
}

main()
.catch(
  function(e) {
    console.log(e)
    process.exit(0)
  }
)

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
    process.exit(1);
  case 'EADDRINUSE':
    console.error(`${bind} is already in use`);
    process.exit(1);
    case 'EBADCSRFTOKEN':
      console.error(`${bind} for has been tampered with`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind =
    typeof addr === 'string' ? `pipe ${addr}` : `${addr.port}`;
  
  /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${bind}`);
    /* eslint-enable no-console */
}