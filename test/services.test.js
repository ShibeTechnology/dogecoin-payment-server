const assert = require('assert');

const { ECPair, payments } = require('bitcoinjs-lib');
const networks = require('../src/networks');
const { PaymentService } = require('../src/services/paymentservice');

const { constructRS, createFundingTx, generatePsbt } = require('./helpers');

describe('payment service', () => {

    const ourKey = ECPair.makeRandom({ network: networks.regtest });
    const ps = new PaymentService(networks.regtest, 1159);

    it('should be a goodPsbtHex', function(done) {
        const customerKey = ECPair.makeRandom({ network: networks.regtest });
        const rs = constructRS(customerKey, ourKey, 300)
        const tx = createFundingTx(rs, 1337 * 1e8);

        const psbt = generatePsbt(tx, rs);
        const result = ps.checkPSBT(ourKey.publicKey.toString('hex'), psbt.toHex());

        assert(result.isOk(), result.errors.join("\n"));
        done();
    })
});
