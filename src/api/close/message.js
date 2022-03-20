const { MissingFieldError } = require('../error')

/*
  Message received when we want to close a payment channel
*/
class CloseMessage {
  constructor (redeemScript) {
    this.redeemScript = redeemScript
  }

  static fromObject (args) {
    if (!Object.prototype.hasOwnProperty.call(args, 'redeemScript')) {
      throw new MissingFieldError('redeemScript')
    }

    const redeemScript = Buffer.from(args.redeemScript, 'hex')

    return new this(redeemScript)
  }
}

module.exports = CloseMessage
