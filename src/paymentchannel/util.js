const { decodeTx, prepareTransactionToSign, encodeRawTransaction } = require('../utils/tx')
const { sign, verify } = require('../utils/crypto')
const { doubleHash } = require('../utils/hash')
const CompactSize = require('../utils/compactSize')

function signPaymentChannelTx (rawtx, payerSignature, redeemScript, privkey) {
  let tx = decodeTx(rawtx)

  tx.txIns[0].signature = redeemScript
  tx.hashCodeType = 1

  const rawTx = prepareTransactionToSign(tx, 0)
  const message = doubleHash(rawTx)
  const signature = sign(message, privkey)

  delete tx.hashCodeType

  const sizeRedeemScript = CompactSize.fromSize(redeemScript.length)
  const sizeSigPayer = CompactSize.fromSize(payerSignature.length + 1)
  const sizeSigPayee = CompactSize.fromSize(signature.length + 1)

  // need to build sig script
  // Do we need to know the order of the pubkey ?
  const sigScript = Buffer.from('00' +
    sizeSigPayer.toString('hex') +
    payerSignature.toString('hex') +
    '01' +
    sizeSigPayee.toString('hex') +
    signature.toString('hex') +
    '01' +
    '00' +
    '4c' +
    sizeRedeemScript.toString('hex') +
    redeemScript.toString('hex'),
  'hex')

  tx.txIns[0].signature = sigScript
  tx.txIns[0].signatureSize = CompactSize.fromSize(sigScript.length)

  tx = encodeRawTransaction(tx)

  return tx
}

function verifyPaymentChannelTx (rawtx, signature, redeemScript, pubkey) {
  const tx = decodeTx(rawtx)

  tx.txIns[0].signature = redeemScript
  tx.hashCodeType = 1

  const rawTx = prepareTransactionToSign(tx, 0)
  const message = doubleHash(rawTx)

  console.log(message.toString('hex'))

  const ok = verify(signature, pubkey, message)

  return ok
}

module.exports = { signPaymentChannelTx, verifyPaymentChannelTx }
