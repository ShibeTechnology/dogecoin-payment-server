const { ECPair } = require('bitcoinjs-lib')
const { signPaymentChannelTx } = require('../src/paymentchannel/util')
const networks = require('../src/networks')
const assert = require('assert')

describe('test signPaymentChannelTx', () => {
  const ourKey = ECPair.fromPrivateKey(Buffer.from('3b187fd3a10960efe5753c9851c174c05bcdb30db22fd9deab981fe1f0ec7b00', 'hex'), {
    compressed: true,
    network: networks.regtest
  })

  it('should create a valid tx', function (done) {
    const expected = '02000000019285f839337f647c94bc74c2d8cce1bcb202d03b31d15769871e1bbe4c197ca400000000fd080100483045022100b115080d411ac11883d37637ab63eca3f93e82064b681c72a38eeb70218d7b7f022044d81ad273e468b3061043cff8306bebe13b22bd3ac17a6f2eb5b4b76cc8ba7f01483045022100e36a076b7e899ec7b198d479426fdca13ceaac226216c67f4743229c7be1b06c022035bbba06084143c96f8e14b67d69bd9ee824621010c0660dc26a8e841d62d7f801004c7263021200b1752102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172ad6752682102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c17221033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d85047752aeffffffff02006fe0d6010000001976a914f155d92633f0ba198d32ed95b65b4e0bcfd7ef1d88ac00943577000000001976a914540246395884a071dee9840ea069124970ab6b2388ac00000000'

    const rawtx = Buffer.from('02000000019285f839337f647c94bc74c2d8cce1bcb202d03b31d15769871e1bbe4c197ca40000000000ffffffff02006fe0d6010000001976a914f155d92633f0ba198d32ed95b65b4e0bcfd7ef1d88ac00943577000000001976a914540246395884a071dee9840ea069124970ab6b2388ac00000000', 'hex')
    const redeemScript = Buffer.from('63021200b1752102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172ad6752682102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c17221033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d85047752ae', 'hex')
    const payerSignature = Buffer.from('3045022100e36a076b7e899ec7b198d479426fdca13ceaac226216c67f4743229c7be1b06c022035bbba06084143c96f8e14b67d69bd9ee824621010c0660dc26a8e841d62d7f8', 'hex')

    const result = signPaymentChannelTx(rawtx, payerSignature, redeemScript, ourKey.privateKey)

    assert.equal(result.toString('hex'), expected)

    done()
  })
})