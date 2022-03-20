const express = require('express')

const networks = require('../../networks')
const { createPayToHash, pubkeyToAddress } = require('../../utils/address')
const db = require('../../database')
const CLTVScript = require('../../paymentchannel/cltv')
const { verifyPaymentChannelTx } = require('../../paymentchannel/util')
const { InvalidSignatureError } = require('../error')

const PaymentMessage = require('./message')
const logger = require('../../logging')

const router = express.Router()
// const paymentService = new PaymentService(networks.regtest)

// Should we include the ref in the url ?
// (e.g payment/123/)
router.post('/', async (req, res) => {
  logger.info('/payment called')
  const paymentMessage = PaymentMessage.fromObject(req.body)

  /*
    Verify payment channel has been funded
  */
  const p2sh = createPayToHash(paymentMessage.redeemScript)
  const address = pubkeyToAddress(p2sh.hashScript, networks.regtest.scriptHash, true)

  const pc = await db.getPaymentChannel(address)
  if (!pc) {
    throw new Error('Payment channel not found.')
  }

  /*
    Verify signature
  */
  const cltv = CLTVScript.fromHex(pc.redeemScript)
  const ok = verifyPaymentChannelTx(paymentMessage.transaction, paymentMessage.signature, Buffer.from(cltv.payerPubkey, 'hex'))

  if (!ok) {
    throw new InvalidSignatureError()
  }

  // save to database
  await db.updatePaymentChannelTransactions(address, {
    timestamp: Date.now(),
    tx: paymentMessage.transaction.toString('hex'),
    signature: paymentMessage.signature.toString('hex'),
    ref: paymentMessage.ref
  })

  return res.send()
})

module.exports = router
