const test = require('ava')
const { ECPair } = require('bitcoinjs-lib')
const networks = require('../src/networks')
const AnnounceService = require('../src/api/announce/service')

const { constructRS } = require('./helpers')

const ourKey = ECPair.makeRandom({ network: networks.regtest })
const as = new AnnounceService(networks.regtest, 0)

test('should be valid', t => {
  const customerKey = ECPair.makeRandom({ network: networks.regtest })
  const rs = constructRS(customerKey, ourKey, 300)

  as.validate(ourKey.publicKey.toString('hex'), rs)

  t.pass()
})
