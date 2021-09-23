const request = require('supertest'),
    app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏'
      }, done);
  });
});

describe('GET /api/v1/address', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1/address')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, ['address'], done);
  });
});

describe('GET /api/v1/payment', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1/payment')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, ['payment'], done);
  });
});