const express = require('express');

const bitcoinjs = require('bitcoinjs-lib')

const router = express.Router();

const channel = require('./channel');
const { jsonRPC } = require('./../util');
const keyPairB = process.env.PUBLIC_KEY

router.get('/', (req, res) => {
});

// change to post req, check that we have pubkey and locktime
// create script generate from script generate P2SH address
// save P2SH address, unique id per item save with script
// to db. want db agnostic. brainstorm storage of script
router.get('/new', (req, res) => {
  return res.send(keyPairB)
});

module.exports = router;
