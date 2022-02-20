const express = require('express')
const secp256k1 = require('secp256k1')

const networks = require('../../networks')
const { decodeTx, prepareTransactionToSign } = require('../../utils/tx')
const { createPayToHash, pubkeyToAddress } = require('../../utils/address')
const { doubleHash } = require('../../utils/hash')
const db = require('../../database')
const CLTVScript = require('../../cltv')
const { InvalidSignatureError } = require('./error')

const PaymentMessage = require('./message')

const router = express.Router()
// const paymentService = new PaymentService(networks.regtest)

// Should we include the ref in the url ?
// (e.g payment/123/)
router.post('/', async (req, res) => {
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
  const tx = decodeTx(paymentMessage.transaction)
  // Check transaction signature once we have the previous tx from database
  tx.hashCodeType = 1
  // payment channel always have 1 txin
  tx.txIns[0].signature = Buffer.from(pc.utxo.txout.scriptPubKey.hex, 'hex')

  const rawUnsignedTransaction = prepareTransactionToSign(tx, 0)
  const rawTransactionHash = doubleHash(rawUnsignedTransaction)

  const cltv = CLTVScript.fromHex(pc.redeemScript)
  const sig = secp256k1.signatureImport(paymentMessage.signature)
  const ok = secp256k1.ecdsaVerify(sig, rawTransactionHash, Buffer.from(cltv.payerPubkey, 'hex'))

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
