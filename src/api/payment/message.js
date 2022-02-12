const { MissingFieldError } = require('../error')

/*
  Message received when we want to create a micro payment buying an item identified by `ref`
*/
class PaymentMessage {
  constructor (transaction, signature, ref) {
    this.transaction = transaction
    this.signature = signature
    this.ref = ref
  }

  static fromObject (args) {
    if (!Object.prototype.hasOwnProperty.call(args, 'transaction')) {
      throw new MissingFieldError('transaction')
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'signature')) {
      throw new MissingFieldError('signature')
    }

    if (!Object.prototype.hasOwnProperty.call(args, 'ref')) {
      throw new MissingFieldError('ref')
    }

    return new this(args.transaction, args.signature, args.ref)
  }
}

module.exports = PaymentMessage
