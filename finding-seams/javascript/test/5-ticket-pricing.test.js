import {expect} from 'chai';
import request from 'supertest';
import {createApp} from '../src/ticket-pricing/ticket-pricing-app.js';

describe('ticket-pricing', () => {
  let app;
  let connection;

  before(async () => {
    const created = await createApp();
    app = created.app;
    connection = created.connection;
  });

  it('calculates price for regular ticket with early bird discount and dips', async () => {
    const response = await request(app)
      .get('/prices')
      .query({type: 'regular', date: '2024-01-15', dips: 3});

    expect(response.status).to.equal(200);
    expect(response.body).to.eql({cost: 70});
  }).timeout(10000);
});
