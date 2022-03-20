const { MissingFieldError } = require('../error')

class AnnounceMessage {
  constructor (redeemScript, transaction, signature) {
    this.redeemScript = redeemScript
    this.transaction = transaction
    this.signature = signature
  }

  /*
      Construct an AnnounceMessage from object
  */
  static fromObject (args) {
    if (!Object.prototype.hasOwnProperty.call(args, 'redeemScript')) {
      throw new MissingFieldError('redeemScript')
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'transaction')) {
      throw new MissingFieldError('transaction')
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'signature')) {
      throw new MissingFieldError('signature')
    }

    const redeemScript = Buffer.from(args.redeemScript, 'hex')
    const transaction = Buffer.from(args.transaction, 'hex')
    const signature = Buffer.from(args.signature, 'hex')

    return new this(redeemScript, transaction, signature)
  }
}

module.exports = AnnounceMessage
