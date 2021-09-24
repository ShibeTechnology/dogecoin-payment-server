const bitcoinjs = require('bitcoinjs-lib')
const bip65 = require('bip65')
const middlewares = require('../middlewares')

// Dogecoin JSON RPC token
const token = Buffer.from('hello:world', 'utf8').toString('base64')

// Initialize Dogecoin testnet info
bitcoinjs.networks.dogecoin_regtest = {
    messagePrefix: '\x18Dogecoin Signed Message:\n',
    bech32: 'tdge',
    bip32: {
      public: 0x0432a9a8,
      private: 0x0432a243
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  }

function jsonRPC (command, params) {
    return postData('http://127.0.0.1:18332', {
		jsonrpc: '1.0',
		id: 'wow',
		method: command, 
		params: params
	}, {
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    },
})
}

