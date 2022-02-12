const express = require('express')

const announce = require('./announce')
const payment = require('./payment')
const pubkey = require('./pubkey')

const router = express.Router()

router.use('/announce', announce)
router.use('/payment', payment)
router.use('/pubkey', pubkey)

module.exports = router
