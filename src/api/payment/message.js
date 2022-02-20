const { MissingFieldError } = require('../error')

/*
  Message received when we want to create a micro payment buying an item identified by `ref`
*/
class PaymentMessage {
  constructor (transaction, redeemScript, signature, ref) {
    this.transaction = transaction
    this.redeemScript = redeemScript
    this.signature = signature
    this.ref = ref
  }

  static fromObject (args) {
    if (!Object.prototype.hasOwnProperty.call(args, 'transaction')) {
      throw new MissingFieldError('transaction')
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'redeemScript')) {
      throw new MissingFieldError('redeemScript')
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'signature')) {
      throw new MissingFieldError('signature')
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'ref')) {
      throw new MissingFieldError('ref')
    }

    const transaction = Buffer.from(args.transaction, 'hex')
    const redeemScript = Buffer.from(args.redeemScript, 'hex')
    const signature = Buffer.from(args.signature, 'hex')

    return new this(transaction, redeemScript, signature, args.ref)
  }
}

module.exports = PaymentMessage
