const express = require('express');
const pubkey = require('./pubkey');
const payment = require('./payment');

const router = express.Router();

router.use('/pubkey', pubkey);
router.use('/payment', payment);

module.exports = router;
