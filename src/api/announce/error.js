/*
    Announce Message Errors classes
*/

class OurKeyNotInMultisigError extends Error {
  constructor () {
    super('Payee public key must be part of the multisig clause.')
    this.name = 'OurKeyNotInMultisigError'
    this.status = 400
  }
}

class OurKeyInCTLVClauseError extends Error {
  constructor () {
    super('Payee public key should not bee in the CTLV clause.')
    this.name = 'OurKeyInCTLVClauseError'
    this.status = 400
  }
}

class BadLocktimeError extends Error {
  constructor (minLocktime) {
    super(`Locktime needs to be greater than ${minLocktime}`)
    this.name = 'BadLocktimeError'
    this.status = 400
  }
}

module.exports = {
  OurKeyNotInMultisigError,
  OurKeyInCTLVClauseError,
  BadLocktimeError
}
