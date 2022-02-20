const express = require('express')

const logger = require('#logging')

const rpc = require('../../utils/rpc')
const db = require('../../database')

const router = express.Router()

const SCRIPTHASH_TYPE = 'scripthash'

// Return pubkey to the person initiating the payment channel (Alice) so they can create the proper redeemscript
router.post('/', function (req, res) {
  const { txid } = req.body

  logger.info('Notification called for : %s', txid)

  rpc.getrawtransaction(txid)
    .then(function (result) {
      const { vout } = result.data.result

      for (const txout of vout) {
        const { type, addresses } = txout.scriptPubKey
        if (type === SCRIPTHASH_TYPE) {
          db.getPaymentChannel(addresses[0])
            .then(function (result) {
              if (result) {
                logger.info('It is our input tx! Save it to db')
                db.updatePaymentChannelUTXO(addresses[0], txid, txout)
              }
            })
        }
      }
    })

  res.send()
})

module.exports = router
