const bitcoinjs = require('bitcoinjs-lib')
const networks = require('../networks')

// TODO: create a config.js file
function checkConfig () {
  const config = [
    process.env.RPC_USER,
    process.env.RPC_PASSWORD,
    process.env.RPC_URL,
    process.env.RPC_PORT,
    process.env.PRIVATE_KEY
  ]
  config.map(k => {
    if (!k) {
      throw new Error('Missing RPC environment variable')
    }
    return true
  })
}

function initKeyPair (key) {
  const keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(key, 'hex'), {
    compressed: true,
    network: networks.regtest
  })
  return keyPair
}

module.exports = {
  checkConfig,
  initKeyPair
}
