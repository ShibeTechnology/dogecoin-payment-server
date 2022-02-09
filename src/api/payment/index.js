const networks = require('../../networks')
const express = require('express')

const PaymentMessage = require('./message')
const PaymentService = require('./service')

const router = express.Router()
const paymentService = new PaymentService(networks.regtest)

// Should we include the ref in the url ?
// (e.g payment/123/)
router.post('/', (req, res) => {
  const paymentMessage = PaymentMessage.fromObject(req.body)

  // For now always ok
  paymentService.checkFunding()
  paymentService.checkSignature()

  return res.send()
})

module.exports = router
