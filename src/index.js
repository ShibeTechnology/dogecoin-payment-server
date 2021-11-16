const app = require('./app');

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://127.0.0.1:${port}`);
  /* eslint-enable no-console */
});

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