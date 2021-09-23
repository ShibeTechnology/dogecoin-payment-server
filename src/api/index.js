const express = require('express');
const address = require('./address');
const payment = require('./payment');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/address', address);

router.use('/payment', payment);

module.exports = router;
