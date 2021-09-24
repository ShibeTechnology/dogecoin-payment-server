const express = require('express');

const bitcoinjs = require('bitcoinjs-lib')

const router = express.Router();

const channel = require('./channel');

router.get('/', (req, res) => {
  res.json(['address']);
});

router.get('/new', (req, res) => {
  const keyPairB = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(process.env.PRIVATE_KEY, 'hex'))
  keyPairB.network = bitcoinjs.networks.dogecoin_regtest
  res.json(keyPairB.publicKey.toString('hex'));
});

module.exports = router;
