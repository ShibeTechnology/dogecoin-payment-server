const express = require('express')
require('express-async-errors')
const logger = require('#logging')
const CloseMessage = require('./message')
const db = require('../../database')
const { createPayToHash, pubkeyToAddress } = require('../../utils/address')
const networks = require('../../networks')
const state = require('../../paymentchannel/state')
const { signPaymentChannelTx } = require('../../paymentchannel/util')
const { NotOpenedError, ChannelAlreadyClosedError, NoPaymentChannelError, NoCommitmentError } = require('./error')

const router = express.Router()

// Close the opened payment channel
router.post('/', async (req, res) => {
  const { config, rpc } = req.app.locals

  logger.info('/close called')

  const closeMessage = CloseMessage.fromObject(req.body)

  const p2sh = createPayToHash(closeMessage.redeemScript)
  const address = pubkeyToAddress(p2sh.hashScript, networks.regtest.scriptHash, true)

  const pc = await db.getPaymentChannel(address)

  // No payment channel found
  if (pc === null) {
    throw new NoPaymentChannelError()
  }

  if (pc.state === state.Announced) {
    throw new NotOpenedError()
  }

  if (pc.state === state.Closed || pc.state === state.Closing) {
    throw new ChannelAlreadyClosedError()
  }

  if (pc.state === state.Opened) {
    logger.info('Opened')

    if (pc.transactions.length < 1) {
      throw new NoCommitmentError()
    }

    let latestTx = pc.transactions[0]
    for (const tx of pc.transactions) {
      if (tx.timestamps > latestTx.timestamps) {
        latestTx = tx
      }
    }

    let tx = Buffer.from(latestTx.tx, 'hex')
    const privkey = Buffer.from(config.privateKey, 'hex')
    const payerSignature = Buffer.from(latestTx.signature, 'hex')
    tx = signPaymentChannelTx(tx, payerSignature, closeMessage.redeemScript, privkey)

    const result = await rpc.sendrawtransaction(tx.toString('hex'))
    logger.info('TxID broadcasted :' + result)

    await db.updatePaymentChannelStatus(address, state.Closing)

    return res.send()
  }

  res.send()
})

module.exports = router
