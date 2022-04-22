const axios = require('axios')
const logger = require('../logging')

async function ping () {
  return await jsonRPC('ping', [])
}

async function importaddress (redeemScript) {
  // IDEA: register under label that correspond to your service
  return await jsonRPC('importaddress', [redeemScript.toString('hex'), 'minecraft', false, true])
}

async function gettransaction (txid) {
  return await jsonRPC('gettransaction', [txid, true])
}

async function getrawtransaction (txid) {
  return await jsonRPC('getrawtransaction', [txid, true])
}

async function decoderawtransaction (tx) {
  return await jsonRPC('decoderawtransaction', [tx])
}

async function sendrawtransaction (tx) {
  return await jsonRPC('sendrawtransaction', [tx])
}

// TODO: Create a RPC service
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
    return result.data
  }).catch(function (err) {
    logger.error(err)
    return err
  })
}

module.exports = {
  ping,
  importaddress,
  gettransaction,
  getrawtransaction,
  decoderawtransaction,
  sendrawtransaction
}
