/*
    Close Errors classes
*/

class NotOpenedError extends Error {
  constructor () {
    super('Payment channel announced but never opened.')
    this.name = 'NotOpenedError'
    this.status = 400
  }
}

class ChannelAlreadyClosedError extends Error {
  constructor () {
    super('Payment channel already closed.')
    this.name = 'ChannelAlreadyClosedError'
    this.status = 400
  }
}

class NoPaymentChannelError extends Error {
  constructor () {
    super('No payment channel found.')
    this.name = 'NoPaymentChannelError'
    this.status = 400
  }
}

class NoCommitmentError extends Error {
  constructor () {
    super('No commitment found in database.')
    this.name = 'NoCommitmentError'
    this.status = 500
  }
}

module.exports = {
  NotOpenedError,
  ChannelAlreadyClosedError,
  NoPaymentChannelError,
  NoCommitmentError
}
