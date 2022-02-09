const request = require('supertest');
const app = require('../src/app');


describe('GET /api/v1/pubkey/new', () => {
    it('responds with json', function(done) {
        request(app)
            .get('/api/v1/pubkey/new')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    })
});

describe('POST /api/v1/announce', () => {

    it('responds with status code 200', function(done) {
        let data = {
            redeemScript: '63021200b17521033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d850477ad67526821023ab50de3fd251fb4808cd7137a60692c4be9cdac54f7a43cc226ffd5bfa0b9c721033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d85047752ae'
        }
        request(app)
            .post('/api/v1/announce')
            .send(data)
            .set('Accept', 'application/json')
            .expect(200,done)
    });

    it('missing `redeemScript` field', function(done) {
        request(app)
            .post('/api/v1/announce')
            .send({})
            .set('Accept', 'application/json')
            .expect(400, {
                'message': 'Missing redeemScript field.',
                'code': null
            }, done)
    });

    it('our key in CLTV clause', function(done) {
        let data = {
            redeemScript: '63021200b17521023ab50de3fd251fb4808cd7137a60692c4be9cdac54f7a43cc226ffd5bfa0b9c7ad67526821023ab50de3fd251fb4808cd7137a60692c4be9cdac54f7a43cc226ffd5bfa0b9c721033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d85047752ae'
        }
        request(app)
            .post('/api/v1/announce')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400, {
                'message': 'Our key must not be part of the CLTV clause.',
                'code': 102
            }, done)
    });
});