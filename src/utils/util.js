const axios = require('axios')
const bitcoinjs = require('bitcoinjs-lib')
const logger = require('../logging')
const networks = require('../networks')

function initKeyPair (key) {
  const keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(key, 'hex'), {
    compressed: true,
    network: networks.regtest
  })
  return keyPair
}

async function jsonRPC (command, params) {
  const token = Buffer.from(`${process.env.RPC_USER}:${process.env.RPC_PASSWORD}`, 'utf8').toString('base64')

  return await axios.post(`http://${process.env.RPC_URL}:${process.env.RPC_PORT}`, {
    jsonrpc: '1.0',
    id: 'wow',
    method: command,
    params: params
  }, {
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(function (result) {
    return result.data.result
  }).catch(function (err) {
    logger.error(err)
    throw err
  })
}

module.exports = {
  jsonRPC,
  initKeyPair
}
