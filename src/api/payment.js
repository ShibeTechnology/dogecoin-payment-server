const express = require('express');

const router = express.Router();

const channel = require('./channel');

router.post('/new', (req, res) => {
    for (k in req.body) {
        !(k == 'tx') && !(k == 'signature') ? console.log('success') : console.log(`${k} not found`);
    }
    res.sendStatus(200)
});

module.exports = router;
