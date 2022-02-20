const { OurKeyNotInMultisigError, BadLocktimeError } = require('./error')
const { createPayToHash, pubkeyToAddress } = require('../../utils/address')
const CLTVScript = require('../../cltv')
const db = require('../../database')

/*
 *  Service that performs all payment channel annoucement related work
 *
 *  Note: this is meant to run as a singleton inside the controller
 *        so do not add request-specific information to the constructor,
 *        instead, pass those to the methods.
 */
class AnnounceService {
  constructor (network, minlt) {
    // network parameters (regtest/testnet/mainnet)
    this.network = network
    // mininum locktime value
    this.minlt = minlt
  }

  /*
    Validate that the redeem script contains the public keys given
    and match the format exepected
  */
  validate (pubkey, redeemScript) {
    const cltv = CLTVScript.fromHex(redeemScript)

    if (cltv.payeePubkey !== pubkey) {
      throw new OurKeyNotInMultisigError()
    }

    // TODO: make this relative to the current block...
    //      ... this will probably make this function async
    if (cltv.locktime < this.minlt) {
      throw new BadLocktimeError(this.minlt)
    }
  }

  saveDB (redeemScript) {
    const p2sh = createPayToHash(redeemScript)
    const address = pubkeyToAddress(p2sh.hashScript, this.network.scriptHash, true)

    return db.savePaymentChannel(address, { redeemScript: redeemScript.toString('hex'), utxo: null, transactions: [] })
  }
}

module.exports = AnnounceService
