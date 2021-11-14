const app = require('./app');
const { jsonRPC } = require('./util')

async function main() {
    // process.env.CONFIG
    // verify envrionment is correct, rpc user pw url port
    // error if not
    // ping the node
    // error if the node doesn't respond
    try {
      let result = await jsonRPC("ping", [])
      console.log(result)
    } catch(e) {
      throw new Error("Failed to contact dogecoin node")
    }
}

main()
.catch(
  function(e) {
    console.log(e)
    process.exit(0)
  }
)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
