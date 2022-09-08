const express = require('express')

const announce = require('./announce')
const payment = require('./payment')
const pubkey = require('./pubkey')
const notification = require('./notification')
const close = require('./close')

const router = express.Router()

router.use(express.json())

router.use('/notification', notification)
router.use('/announce', announce)
router.use('/payment', payment)
router.use('/pubkey', pubkey)
router.use('/close', close)

// Error handler
router.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    id: err.name || null
  })
})

module.exports = router
