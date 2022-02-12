/** Service that performs all payment related work
 *
 *  Note: this is meant to run as a singleton inside the controller
 *        so do not add request-specific information to the constructor,
 *        instead, pass those to the methods.
 */
class PaymentService {
  constructor (network) {
    this.network = network
  }

  /** Check the funding of a tx through our blocksource */
  checkFunding (minConfirms, expiresAt, txid, txHex, p2sh) {

    // TODO: confirm block height on the blockchain
    // TODO: check confirmations
    // TODO: check not expired

  }

  /** check the counterparty signature on a psbt */
  checkSignature (pubkey, signature) {
    // TODO: verify signature

  }
}

module.exports = PaymentService
