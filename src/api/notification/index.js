const express = require('express')

const logger = require('#logging')

const { decodeTx } = require('../../utils/tx')
const db = require('../../database')
const PaymentChannelState = require('../../paymentchannel/state')

const router = express.Router()

const SCRIPTHASH_TYPE = 'scripthash'

// Return pubkey to the person initiating the payment channel (Alice) so they can create the proper redeemscript
router.post('/', function (req, res) {
  const { rpc } = req.app.locals
  const { txid } = req.body

  logger.info('Notification called for : %s', txid)

  rpc.getrawtransaction(txid)
    .then(function (result) {
      const { vout } = result

      for (const txout of vout) {
        const { type, addresses } = txout.scriptPubKey
        if (type === SCRIPTHASH_TYPE) {
          db.getPaymentChannel(addresses[0])
            .then(function (result) {
              if (result) {
                logger.info('Found payment channel in database')

                switch (result.state) {
                  case PaymentChannelState.Announced:
                    if (result.transactions.length > 0) {
                      logger.info(JSON.stringify(result.transactions[0]))
                      const tx = decodeTx(Buffer.from(result.transactions[0].tx, 'hex'))

                      if (txid !== tx.id.toString('hex')) {
                        logger.warn('txid is different from the payment channel return tx saved')
                      }
                    }

                    db.updatePaymentChannelUTXO(addresses[0], txid, txout, PaymentChannelState.Opened)
                    break
                  case PaymentChannelState.Closing:
                    db.updatePaymentChannelUTXO(addresses[0], txid, txout, PaymentChannelState.Closed)
                    break
                  default:
                    logger.info('Nothing to do')
                }
              }
            })
        }
      }
    })

  res.send()
})

module.exports = router
