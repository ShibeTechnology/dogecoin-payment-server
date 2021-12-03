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

const initPaymentService = (expiry) => {
    return new PaymentService(networks.regtest, expiry);
}

describe('payment service', () => {
    const keyPairA = generateKeyPair()
    const keyPairB = generateKeyPair()
    const locktime = generateLockTime(300)
    const rs = constructRS(locktime, keyPairA, keyPairB)
    const p2sh = generateP2SH(rs)
    const alice = bitcoinjs.payments.p2pkh({ pubkey: keyPairA.publicKey, network: networks.regtest })
    let tx = generateTx(p2sh, 100000000, alice, keyPairA)
    let ps = initPaymentService(1159)
    let result = ''
    it('should be a goodPsbtHex', function(done) {
        console.log(tx)
        let res = generatePsbtHex(tx, p2sh, 100000000, alice, keyPairA, rs)
        console.log(res)
        console.log(ps)
        result = ps.checkPSBT(keyPairA.publicKey.toString('hex'), res.toHex())
        console.log(result)
        done()
    })
});
