const bitcoinjs = require('bitcoinjs-lib')
const networks = require('../networks')

function initKeyPair (key) {
  const keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(key, 'hex'), {
    compressed: true,
    network: networks.regtest
  })
  return keyPair
}

module.exports = {
  initKeyPair
}
