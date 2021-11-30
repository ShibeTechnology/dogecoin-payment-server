const request = require('supertest');
const app = require('../src/app');
const bitcoinjs = require('bitcoinjs-lib')

describe('GET /api/v1', () => {

});

describe('GET /api/v1/pubkey/new', () => {
    it('responds with json', function(done) {
        request(app)
            .get('/api/v1/pubkey/new')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                return done()
            })
    })
});

describe('POST /api/v1/payment', () => {
    let psbt = new bitcoinjs.Psbt()
    psbt = "70736274ff010033020000000186d492d1e940b8f54162c7df2af406a62d4c87b5ed126ab26d498198151cc42d0000000000ffffffff0000000000000100be020000000147e67b2c0a5a84849d223fcf2e2769aed9d6db7f2e1b1686cb8554b53c03ebbe000000006b483045022100973a2e85162e0b41cae5d1cb25b2eb9c8c1b72726ba1a5c63b20bf2f233745fc02203cbe5435e8537b26a23b1b125590c1e20d6078ae2e2dd42615ce71d5840779a1012102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172ffffffff0100e40b540200000017a91460e13f72a15aab828ba9f408192c05bd17f9647a870000000001047263021200b1752102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172ad6752682102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c17221033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d85047752ae0000"
    let data = {
        'type': 'announce',
        'ref': undefined,
        'psbt': psbt.toString('hex')
    }
    it('responds with status code 200', function(done) {
        request(app)
            .post('/api/v1/payment')
            .send(data)
            .set('Accept', 'application/json')
            .expect(200, {
                'errors': [],
                'status': 'ok'
            }, done)
    })
});

describe('POST /api/v1/payment', () => {
    let psbt = new bitcoinjs.Psbt()
    psbt = "000000186d492d1e940b8f54162c7df2af406a62d4c87b5ed126ab26d498198151cc42d0000000000ffffffff0000000000000100be020000000147e67b2c0a5a84849d223fcf2e2769aed9d6db7f2e1b1686cb8554b53c03ebbe000000006b483045022100973a2e85162e0b41cae5d1cb25b2eb9c8c1b72726ba1a5c63b20bf2f233745fc02203cbe5435e8537b26a23b1b125590c1e20d6078ae2e2dd42615ce71d5840779a1012102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172ffffffff0100e40b540200000017a91460e13f72a15aab828ba9f408192c05bd17f9647a870000000001047263021200b1752102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172ad6752682102695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c17221033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d85047752ae0000"
    let data = {
        'type': 'announce',
        'ref': undefined,
        'psbt': psbt.toString('hex')
    }
    it('responds with psbt needs to be a hexadecimal string', function(done) {
        request(app)
            .post('/api/v1/payment')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400, {
                'errors': ['psbt needs to be a hexadecimal string'],
                'status': 'error'
            }, done)
    })
});