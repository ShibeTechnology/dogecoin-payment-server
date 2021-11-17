const express = require('express');

const bitcoinjs = require('bitcoinjs-lib')

const router = express.Router();

const channel = require('./channel');
const { jsonRPC } = require('./../util');

router.get('/', (req, res) => {
  console.log(res.statusCode)
  let result = jsonRPC("getnetworkinfo", [])
  console.log(result)
  res.json(res.statusCode)
});

// change to post req, check that we have pubkey and locktime
// create script generate from script generate P2SH address
// save P2SH address, unique id per item save with script
// to db. want db agnostic. brainstorm storage of script
router.get('/new', (req, res) => {
  const keyPairB = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(process.env.PRIVATE_KEY, 'hex'))
  keyPairB.network = bitcoinjs.networks.dogecoin_regtest
  res.json(keyPairB.publicKey.toString('hex'));
});

module.exports = router;
