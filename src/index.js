const app = require('./app');
const { jsonRPC } = require('./util')

async function main() {
    // process.env.CONFIG
    // verify envrionment is correct, rpc user pw url port
    // error if not
    // ping the node
    // error if the node doesn't respond
    let result = await jsonRPC("ping", [])
    console.log(result)
}

main()

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
