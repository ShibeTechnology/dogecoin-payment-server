const axios = require('axios');
const bitcoinjs = require('bitcoinjs-lib');
const bip65 = require('bip65');

let config = [
  process.env.RPC_USER, 
  process.env.RPC_PASSWORD, 
  process.env.RPC_URL, 
  process.env.RPC_PORT,
  process.env.PRIVATE_KEY
]

function checkConfig(x) {
  x.map(k => {
    if (!k) {
      throw new Error(`Missing RPC environment variable`)
    }
  })
}

try {
  checkConfig(config)
} catch(e) {
  console.log(e.message)
  process.exit(0)
}

function initRegtest() {
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
}

initRegtest()

function initPubKey() {
  const keyPairB = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(process.env.PRIVATE_KEY, 'hex'))
  keyPairB.network = bitcoinjs.networks.dogecoin_regtest
  process.env.PUBLIC_KEY=keyPairB.publicKey.toString('hex')
}

initPubKey()

// Dogecoin JSON RPC token
const token = Buffer.from(`${process.env.RPC_USER}:${process.env.RPC_PASSWORD}`, 'utf8').toString('base64')

async function jsonRPC (command, params) {
    const response = await axios.post(`http://${process.env.RPC_URL}:${process.env.RPC_PORT}`, {
      jsonrpc: '2.0',
      id: 'payment channel much wow',
      method: command, 
      params: params
    }, {
      headers: {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then(function (result) {
      console.log(result.data)
    })
    .catch(function(error) {
      console.log(error.message);
    })
    return response
}

module.exports = {
    jsonRPC
}