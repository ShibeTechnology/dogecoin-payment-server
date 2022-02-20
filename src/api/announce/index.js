const express = require('express')

const AnnounceMessage = require('./message')
const AnnounceService = require('./service')
const { initKeyPair } = require('../../utils/util')
const rpc = require('../../utils/rpc')
const networks = require('../../networks')

// TODO: find a more appropriate value
const MIN_CHANNEL_EXPIRY = 0

const router = express.Router()
const announceService = new AnnounceService(networks.regtest, MIN_CHANNEL_EXPIRY)

router.post('/', async (req, res) => {
  const { body } = req

  // Express is able to catch error and send the message on its own;
  const keyPair = initKeyPair(process.env.PRIVATE_KEY)
  const pubkey = keyPair.publicKey.toString('hex')

  const announcemsg = AnnounceMessage.fromObject(body)
  announceService.validate(pubkey, announcemsg.redeemScript)

  // Import the address to our dogecoin node
  // It allows being notified when the transaction has been included in a block
  // TODO: this should probably be part of the service
  rpc.importaddress(announcemsg.redeemScript)

  // Because express 4.x don't support `await`
  await announceService.saveDB(announcemsg.redeemScript)

  res.send()
})

module.exports = router
