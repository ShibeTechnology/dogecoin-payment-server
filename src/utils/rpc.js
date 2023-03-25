const { jsonRPC } = require('./util')

class RPC {
  async ping () {
    return await jsonRPC('ping', [])
  }

  async importaddress (redeemScript) {
    // IDEA: register under label that correspond to your service
    return await jsonRPC('importaddress', [redeemScript.toString('hex'), 'minecraft', false, true])
  }

  async gettransaction (txid) {
    return await jsonRPC('gettransaction', [txid, true])
  }

  async getrawtransaction (txid) {
    return await jsonRPC('getrawtransaction', [txid, true])
  }

  async decoderawtransaction (tx) {
    return await jsonRPC('decoderawtransaction', [tx])
  }

  async sendrawtransaction (tx) {
    return await jsonRPC('sendrawtransaction', [tx])
  }
}

module.exports = RPC
