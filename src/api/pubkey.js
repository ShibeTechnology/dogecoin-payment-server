const express = require('express');
const { initKeyPair } = require('../util');

const router = express.Router();

// Return pubkey to the person initiating the payment channel (Alice) so they can create the proper redeemscript
router.get('/new', (req, res) => {
  const keyPair = initKeyPair(process.env.PRIVATE_KEY)
  return res.send({
    pubkey: keyPair.publicKey.toString('hex')
  })
});

module.exports = router;
