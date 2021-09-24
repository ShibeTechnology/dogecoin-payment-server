const express = require('express');

const router = express.Router();

const channel = require('./channel');

router.get('/', (req, res) => {
  res.json(['payment']);
});

module.exports = router;
