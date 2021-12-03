const assert = require('assert');

const bitcoinjs = require('bitcoinjs-lib');
const networks = require('../src/networks');
const { PaymentService } = require('../src/services/paymentservice');

const {
  constructRS,
  generateKeyPair,
  generateLockTime,
  generateP2SH,
  generatePsbtHex,
  generateTx,
} = require('./helpers');

describe('payment service', () => {
    const keyPairA = generateKeyPair()
    const keyPairB = generateKeyPair()
    const locktime = generateLockTime(300)
    const rs = constructRS(locktime, keyPairA, keyPairB)
    const p2sh = generateP2SH(rs)
    const alice = bitcoinjs.payments.p2pkh({ pubkey: keyPairA.publicKey, network: networks.regtest })
    const tx = generateTx(p2sh, 100000000, alice, keyPairA)
    const ps = new PaymentService(networks.regtest, 1159);

    it('should be a goodPsbtHex', function(done) {
        const psbt = generatePsbtHex(tx, p2sh, 100000000, alice, keyPairA, rs)
        const result = ps.checkPSBT(keyPairA.publicKey.toString('hex'), psbt.toHex())
        assert(result.isOk(), result.errors.join("\n"))
        done()
    })
});
