/*
    Announce Message Errors classes
*/

class MalformedRedeemScriptError extends Error {
  constructor (pos) {
    super(`Malformed redeemscript at position ${pos}`)
    this.name = 'MissingFieldError'
    this.status = 400
    this.code = 101
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

class TheirKeyNotInMultisigError extends Error {
  constructor () {
    super('Their key must be part of the multisig clause.')
    this.name = 'TheirKeyNotInMultisigError'
    this.status = 400
    this.code = 103
  }
}

class OurKeyNotInMultisigError extends Error {
  constructor () {
    super('Our key must be part of the multisig clause.')
    this.name = 'OurKeyNotInMultisigError'
    this.status = 400
    this.code = 104
  }
}

class BadLocktimeError extends Error {
  constructor (minLocktime) {
    super(`Locktime needs to be greater than ${minLocktime}`)
    this.name = 'BadLocktimeError'
    this.status = 400
    this.code = 105
  }
}

module.exports = {
  MalformedRedeemScriptError,
  WrongKeyInCLTVError,
  TheirKeyNotInMultisigError,
  OurKeyNotInMultisigError,
  BadLocktimeError
}
