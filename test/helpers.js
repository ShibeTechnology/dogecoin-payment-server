const { payments, Psbt, script, Transaction } = require('bitcoinjs-lib')
const bip65 = require('bip65')

const encodeLocktime = (n) => {
  n.length === 0 ? n = 0 : n = 300
  return Buffer.from(bip65.encode({ blocks: n }).toString(16), 'hex').reverse().toString('hex')
}

const constructRS = (customer, merchant, locktime) => {
  const encodedLocktime = encodeLocktime(locktime)

  return script.fromASM('OP_IF ' + encodedLocktime + '00' + ' OP_CHECKLOCKTIMEVERIFY OP_DROP ' +
    customer.publicKey.toString('hex') + ' OP_CHECKSIGVERIFY OP_ELSE OP_2 OP_ENDIF ' +
    customer.publicKey.toString('hex') + ' ' + merchant.publicKey.toString('hex') + ' OP_2 OP_CHECKMULTISIG')
}

// simply mine into the p2sh with a coinbase tx
function createFundingTx (targetRedeemscript, amount) {
  const tx = new Transaction()

  // coinbase input
  tx.addInput(Buffer.alloc(32).fill(0x00), 0xffffffff)

  // create a p2sh script from the redeemScript
  const target = payments.p2sh({ redeem: { output: targetRedeemscript } })

  // p2sh output
  tx.addOutput(target.output, amount)

  return tx
}

function generatePsbt (fundingTx, redeemScript) {
  const psbt = new Psbt()

  psbt.addInput({
    hash: fundingTx.getHash(),
    index: 0,
    nonWitnessUtxo: fundingTx.toBuffer(),
    redeemScript: redeemScript
  })

  return psbt
}

module.exports = {
  constructRS,
  createFundingTx,
  encodeLocktime,
  generatePsbt
}
