const { script } = require('bitcoinjs-lib')

/** Helper lambda to check public key hex in scripts */
const checkKeyLength = (key) => Buffer.from(key, 'hex').length === 33

const RS_STRUCTURE = [
  op => op === 'OP_IF',
  num => parseInt(num, 10) > 0,
  op => op === 'OP_CHECKLOCKTIMEVERIFY',
  op => op === 'OP_DROP',
  checkKeyLength,
  op => op === 'OP_CHECKSIGVERIFY',
  op => op === 'OP_ELSE',
  op => op === 'OP_2',
  op => op === 'OP_ENDIF',
  checkKeyLength,
  checkKeyLength,
  op => op === 'OP_2',
  op => op === 'OP_CHECKMULTISIG'
]

/*
  CLTV script used to open payment channel
  https://en.bitcoin.it/wiki/Payment_channels#CLTV-style_payment_channels
*/
class CLTVScript {
  constructor (locktime, payerPubkey, payeePubkey) {
    this.locktime = locktime
    this.payerPubkey = payerPubkey
    this.payeePubkey = payeePubkey
  }

  static fromHex (redeemScript) {
    redeemScript = Buffer.from(redeemScript, 'hex')
    const rsASM = script.toASM(redeemScript).split(' ')

    // strict redeemscript syntax check to our format
    RS_STRUCTURE.forEach((chk, i) => {
      if (!chk(rsASM[i])) {
        throw new MalformedRedeemScriptError(i)
      }
    })

    const keys = {
      us: null,
      them: rsASM[4],
      both: rsASM.slice(9, 11)
    }

    const index = keys.both.indexOf(keys.them)
    if (index < 0) {
      throw new TheirKeyNotInMultisigError()
    }
    keys.us = keys.both[index + 1 % 2]

    if (keys.them === keys.us) {
      throw new WrongKeyInCLTVError()
    }

    const locktime = parseInt(rsASM[1], 10)

    return new this(locktime, keys.them, keys.us)
  }
}

class MalformedRedeemScriptError extends Error {
  constructor (pos) {
    super(`Malformed redeemscript at position ${pos}`)
    this.name = 'MissingFieldError'
    this.status = 400
    this.code = 101
  }
}

class TheirKeyNotInMultisigError extends Error {
  constructor () {
    super('Their key must be part of the multisig clause.')
    this.name = 'TheirKeyNotInMultisigError'
    this.status = 400
    this.code = 103
  }
}

class WrongKeyInCLTVError extends Error {
  constructor () {
    super('Our key must not be part of the CLTV clause.')
    this.name = 'WrongKeyInCLTVError'
    this.status = 400
    this.code = 102
  }
}

module.exports = CLTVScript
