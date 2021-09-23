const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(['payment']);
});

module.exports = router;
