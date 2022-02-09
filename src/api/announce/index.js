const express = require('express')

const AnnounceMessage = require('./message')
const AnnounceService = require('./service')
const { initKeyPair, importaddress } = require('../../util')
const networks = require('../../networks')

// TODO: find a more appropriate value
const MIN_CHANNEL_EXPIRY = 0

const router = express.Router();
const announceService = new AnnounceService(networks.regtest, MIN_CHANNEL_EXPIRY)

router.post('/', (req, res) => {
    // Express is able to catch error and send the message on its own;
    const keyPair = initKeyPair(process.env.PRIVATE_KEY)
    const pubkey = keyPair.publicKey.toString('hex')

    const announcemsg = AnnounceMessage.fromObject(req.body)
    announceService.validate(pubkey, announcemsg.redeemScript)

    // Import the address to our dogecoin node
    // It allows being notified when the transaction has been included in a block
    // TODO: this should probably be part of the service
    importaddress(announcemsg.redeemScript)
        .then(function (res) {
            console.log(res.data)
        })

    // TODO: save to database

    return res.send()
})

module.exports = router;
