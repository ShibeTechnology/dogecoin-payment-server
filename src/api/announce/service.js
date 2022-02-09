const { script } = require('bitcoinjs-lib')
const {
	MalformedRedeemScriptError,
	WrongKeyInCLTVError,
	TheirKeyNotInMultisigError,
	OurKeyNotInMultisigError,
	BadLocktimeError
} = require('./error')

/** Helper lambda to check public key hex in scripts */
const checkKeyLength = (key) => Buffer.from(key, "hex").length === 33


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

/*
 *	Service that performs all payment channel annoucement related work
 *
 *  Note: this is meant to run as a singleton inside the controller
 *        so do not add request-specific information to the constructor,
 *        instead, pass those to the methods.
 */
class AnnounceService {
	constructor(network, minlt) {
		// network parameters (regtest/testnet/mainnet)
		this.network = network
		// mininum locktime value
		this.minlt = minlt
	}

	/*
		Validate that the redeem script contains the public keys given
		and match the format exepected
	*/
	validate(pubkey, redeemScript) {
		/// SYNTACTIC VALIDATION ///
		const rsASM = script.toASM(redeemScript).split(" ")

		// strict redeemscript syntax check to our format
		RS_STRUCTURE.forEach((chk, i) => {
			if (!chk(rsASM[i])) {
				throw new MalformedRedeemScriptError(i)
			}
		});

		/// END OF SYNTACTIC VALIDATION ///

		///     -------------------     ///
		///     SEMANTIC VALIDATION    ///
		///     -------------------     ///


		// check the keys
		const keys = {
			us: pubkey,
			them: rsASM[4],
			both: rsASM.slice(9, 11)
		}

		if (keys.them === keys.us) {
			throw new WrongKeyInCLTVError()
		}
		if (keys.both.indexOf(keys.them) === -1) {
			throw new TheirKeyNotInMultisigError()
		}
		if (keys.both.indexOf(keys.us) === -1) {
			throw new OurKeyNotInMultisigError()
		}

		// check expiry
		//TODO: make this relative to the current block...
		//      ... this will probably make this function async
		if (parseInt(rsASM[1], 10) < this.minlt) {
			throw new BadLocktimeError(this.minlt)
		}
	}

	saveDB(redeemScript) {
		// TODO: save to database
	}
}

module.exports = AnnounceService
