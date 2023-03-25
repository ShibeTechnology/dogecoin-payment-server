const express = require('express')
const db = require('../database')
const { jsonRPC } = require('../utils/util')
const CLTVScript = require('../paymentchannel/cltv')
const { pubkeyToPubkeyHash } = require('../utils/address')
const PaymentChannelState = require('../paymentchannel/state')

const router = express.Router()

router.use('/', async function (req, res) {
  let body = `
  <h2>
  Payment Channels<br/>
  ================
  </h2>
  <br/>
  P2SH address <span style="padding: 120px"></span>Funds available <br/>
  -------------<span style="padding: 120px"></span>--------------- <br/>
  `
  let totalBalance = 0

  const paymentchannels = await db.getAllPaymentChannels()
  for (const pc of paymentchannels) {
    let amount = 0
    if (pc.utxo) {
      amount += pc.utxo.txout.value
    }

    let latestCommitment = pc.transactions[0]
    for (const transaction of pc.transactions) {
      if (latestCommitment && latestCommitment.timestamp < transaction.timestamp) {
        latestCommitment = transaction
      }
    }

    if (latestCommitment) {
      const pubkey = CLTVScript.fromHex(pc.redeemScript).payeePubkey
      const pubkeyHash = pubkeyToPubkeyHash(Buffer.from(pubkey, 'hex'))
      const result = await jsonRPC('decoderawtransaction', [latestCommitment.tx])
      const tx = result

      for (const vout of tx.vout) {
        if (vout.scriptPubKey.hex.includes(pubkeyHash.toString('hex'))) {
          amount -= vout.value
          totalBalance += vout.value
          break
        }
      }
    }

    if (pc.state === PaymentChannelState.Closed) {
      continue
    }

    body += `${pc.address} -> ${amount} Đ<br/>`
  }

  body += `<br/><br/>Total Balance : ${totalBalance} Đ`

  res.send(`
<!DOCTYPE html>
  <html lang="fr">
    <head>
      <title>Dogecoin Payment Server</title>
      <meta charset="utf-8">
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta name="description" content="Dogecoin payment server admin (demo).">
      <meta name="keywords" content="Dogecoin,payment,demo">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <base href="/">
      <style type="text/css">
        body {
          font-family: "Courier New", Courier, monospace;
          margin-left: 30px;
        }
        h1, h2, h3 {
          font-weight: 400;
        }
      </style>
    </head>
    <body style="margin-bottom: 0px;">
      ${body}
    </body>
  </html>
`
  )
})

module.exports = router
