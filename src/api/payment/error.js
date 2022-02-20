
/*
    Payment Message Errors classes
*/

class NotValidMessageError extends Error {
  constructor () {
    super('Not valid message.')
    this.name = 'NotValidError'
    this.status = 400
  }
}

class InvalidSignatureError extends Error {
  constructor () {
    super('Invalid signature. Micropayment invalid.')
    this.name = 'InvalidSignatureError'
    this.status = 400
  }
}

module.exports = {
  NotValidMessageError,
  InvalidSignatureError
}
