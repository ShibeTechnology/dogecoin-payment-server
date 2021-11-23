const assert = require('assert');
const { Psbt, script, payments } = require('bitcoinjs-lib');

const { Validator } = require("../validation");

/** Helper lambda to check public key hex in scripts */
const checkKeyLength = (key) => Buffer.from(key, "hex").length === 33;

/** Array of stack element check lambdas,
 *  to make sure we got the redeemscript we expected.
 */
//TODO: THIS IS UGLY! We may be able to use some internal functions of
//      BitcoinJS.script instead...
const RS_STRUCTURE = [
  op => op === "OP_IF",
  num => parseInt(num, 10) > 0,
  op => op === "OP_CHECKLOCKTIMEVERIFY",
  op => op === "OP_DROP",
  checkKeyLength,
  op => op === "OP_CHECKSIGVERIFY",
  op => op === "OP_ELSE",
  op => op === "OP_2",
  op => op === "OP_ENDIF",
  checkKeyLength,
  checkKeyLength,
  op => op === "OP_2",
  op => op === "OP_CHECKMULTISIG"
];

/** Service that performs all payment related work
 *
 *  Note: this is meant to run as a singleton inside the controller
 *        so do not add request-specific information to the constructor,
 *        instead, pass those to the methods.
 */
class PaymentService {

  network;
  minChannelExpiry;

  constructor(network, minChannelExpiry) {
    this.network = network;
    this.minChannelExpiry = minChannelExpiry;
  }

  /** Validate a PSBT against syntax and semantic checks */
  checkPSBT(publicKey, psbtHex) {
    const validator = new Validator();

    /// SYNTACTIC VALIDATION ///

    // parse and assert requirements on the PSBT
    let psbt;
    try {
      psbt = Psbt.fromHex(psbtHex);
      assert(typeof psbt.data === "object");
      assert(Array.isArray(psbt.data.inputs));
      assert(psbt.data.inputs.length > 0)
    } catch (e) {
      validator.caught(e);
      return validator.result;
    }

    // parse the redeemscript
    let rsASM;
    try {
      rsASM = script.toASM(psbt.data.inputs[0].redeemScript).split(" ");
    } catch (e) {
      validator.caught(e);
      return validator.result;
    }

    // strict redeemscript syntax check to our format
    RS_STRUCTURE.forEach((chk, i) => {
      validator.test(rsASM[i], chk, "Malformed redeemscript at position " + i);
    });

    // if there are syntax errors in the script, return here, because there
    // is no reason to continue (p2sh will fail, semantic validation will fail).
    if (!validator.result.isOk())
      return validator.result;

    // check p2sh address
    let p2sh;
    try {
      p2sh = payments.p2sh({
          redeem: { output: psbt.data.inputs[0].redeemScript },
          network: this.network
      });
    } catch (e) {
      validator.caught(e);
      return validator.result;
    }

    /// END OF SYNTACTIC VALIDATION ///

    ///     -------------------     ///
    ///     SEMANTIC VALIDATION    ///
    ///     -------------------     ///

    // check expiry
    //TODO: make this relative to the current block...
    //      ... this will probably make this function async
    validator.test(rsASM[1], lt => parseInt(lt, 10) > this.minChannelExpiry,
                    "locktime needs to be greater than " + this.minChannelExpiry);

    // check the keys
    const keys = {
      us: publicKey,
      them: rsASM[4],
      both: rsASM.slice(9,11)
    }

    console.log(keys.both)

    validator.test(keys, keys => keys.them != keys.us,
                    "our key must not be part of the CLTV clause");
    validator.test(keys, keys => keys.both.indexOf(keys.them) !== -1,
                    "their key must be part of the multisig clause");
    validator.test(keys, keys => keys.both.indexOf(keys.us) !== -1,
                    "our key must be part of the multisig clause");

    //TODO: check p2sh to be funded with the txHex

    return validator.result;
  }

  /** Check the funding of a tx through our blocksource */
  async checkFunding(minConfirms, expiresAt, txid, txHex, p2sh) {
    const validator = new Validator();

    //TODO: confirm block height on the blockchain
    //TODO: check confirmations
    //TODO: check not expired

    return validator.result;
  }

  /** check the counterparty signature on a psbt */
  checkSignature(psbt) {
    const validator = new Validator();

    //TODO: extract counterparty pubkey from psbt redeemscript
    //TODO: for each input, check that the signature for the pubkey matches

    return validator.result;
  }

}

module.exports = { PaymentService };
