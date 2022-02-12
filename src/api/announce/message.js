const { MissingFieldError } = require('../error')

class AnnounceMessage {
  constructor (redeemScript) {
    this.redeemScript = redeemScript
  }

  /*
      Construct an AnnounceMessage from object
  */
  static fromObject (args) {
    if (!Object.prototype.hasOwnProperty.call(args, 'redeemScript')) {
      throw new MissingFieldError('redeemScript')
    }
    const redeemScript = Buffer.from(args.redeemScript, 'hex')

    return new this(redeemScript)
  }
}

module.exports = AnnounceMessage
