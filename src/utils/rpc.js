const axios = require('axios')
const logger = require('../logging')

class RPC {
  constructor (config = {}) {
    // TODO: verify we have all the config (url, port, user, password)
    this.config = config
  }

  async ping () {
    return await jsonRPC(this.config, 'ping', [])
  }

  async importaddress (redeemScript) {
    // IDEA: register under label that correspond to your service
    return await jsonRPC(this.config, 'importaddress', [redeemScript.toString('hex'), 'minecraft', false, true])
  }

  async gettransaction (txid) {
    return await jsonRPC(this.config, 'gettransaction', [txid, true])
  }

  async getrawtransaction (txid) {
    return await jsonRPC(this.config, 'getrawtransaction', [txid, true])
  }

  async decoderawtransaction (tx) {
    return await jsonRPC(this.config, 'decoderawtransaction', [tx])
  }

  async sendrawtransaction (tx) {
    return await jsonRPC(this.config, 'sendrawtransaction', [tx])
  }
}

async function jsonRPC (config, command, params) {
  const token = Buffer.from(`${config.user}:${config.password}`, 'utf8').toString('base64')

  return await axios.post(`http://${config.url}:${config.port}`, {
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

module.exports = RPC
