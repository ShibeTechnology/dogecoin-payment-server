const test = require('ava')
const request = require('supertest')
const createApp = require('../src/app')

const app = createApp()

test('GET /api/v1/pubkey/new - responds with json', async t => {
  await new Promise(function (resolve, reject) {
    request(app)
      .get('/api/v1/pubkey/new')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, resolve)
  })

  t.pass()
})

test('POST /api/v1/announce - responds with status code 200', async t => {
  const data = {
    redeemScript: '63021200b1752102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172ad6752682102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c17221039153a52f4e6708a08cd8da25e59f68f9e6a4ffe8576ab5532e9d7f0262c8860252ae',
    signature: '304402205621f1e29d8bc8acbc21bb48e83f27628e72262c8fde5dc32325a067f2a504e802204f813de08a56debfd16c60c68e64e98fac7122eb18a4bfffa60b87f4b2ab3a05',
    transaction: '0200000001c96e0af508626454f26da969d23fc4c298928a85672c61de4242fe588fb480a10000000000ffffffff010003164e020000001976a914f155d92633f0ba198d32ed95b65b4e0bcfd7ef1d88ac00000000'
  }
  await new Promise(function (resolve, reject) {
    request(app)
      .post('/api/v1/announce')
      .send(data)
      .set('Accept', 'application/json')
      .expect(200, resolve)
  })

  t.pass()
})

test('POST /api/v1/announce - missing `redeemScript` field', async t => {
  await new Promise(function (resolve, reject) {
    request(app)
      .post('/api/v1/announce')
      .send({})
      .set('Accept', 'application/json')
      .expect(400, {
        message: 'Missing redeemScript field.',
        id: 'MissingFieldError'
      }, resolve)
  })

  t.pass()
})

test('POST /api/v1/announce - our key in CLTV clause', async t => {
  const data = {
    redeemScript: '63021200b17521039153a52f4e6708a08cd8da25e59f68f9e6a4ffe8576ab5532e9d7f0262c88602ad67526821039153a52f4e6708a08cd8da25e59f68f9e6a4ffe8576ab5532e9d7f0262c8860221033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d85047752ae',
    signature: '3045022100b6f4ca4b3d326f2a9e03e50ffd1b4806660df79f8897f4393df449ce7d055031022013cae6c41b9c6514bbd724eee85533f0cbe188d5e408a66a8e14e4f7a0b7de9301',
    transaction: '0200000001c61aa76872607a47c58cd7176c1ce8db44f463127f5f87f45a6aa3a23c40b58f0000000000ffffffff010003164e020000001976a914f155d92633f0ba198d32ed95b65b4e0bcfd7ef1d88ac00000000'
  }
  // TODO: fix because this is confusing our public key is in the CTLV clause when it should be the payer key one.
  await new Promise(function (resolve, reject) {
    request(app)
      .post('/api/v1/announce')
      .send(data)
      .set('Accept', 'application/json')
      .expect(400, {
        message: 'Payee public key must be part of the multisig clause.',
        id: 'OurKeyNotInMultisigError'
      }, resolve)
  })

  t.pass()
})
