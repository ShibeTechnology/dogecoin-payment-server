const express = require('express');

const router = express.Router();

const channel = require('./channel');

router.get('/', (req, res) => {
  res.json(['address']);
});

module.exports = router;
