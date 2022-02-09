const assert = require('assert')

const { ECPair } = require('bitcoinjs-lib')
const networks = require('../src/networks')
const AnnounceService = require('../src/api/announce/service')

const { constructRS, createFundingTx, generatePsbt } = require('./helpers');

describe('announce service', () => {

    const ourKey = ECPair.makeRandom({ network: networks.regtest })
    const as = new AnnounceService(networks.regtest, 0)

    it('should be valid', function(done) {
        const customerKey = ECPair.makeRandom({ network: networks.regtest })
        const rs = constructRS(customerKey, ourKey, 300)

        as.validate(ourKey.publicKey.toString('hex'), rs)

        done()
    })
});
