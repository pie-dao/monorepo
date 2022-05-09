import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import main from './main';

describe("myApp", () => {
  jest.setTimeout(50000);
  let app: INestApplication;

  beforeAll(async () => {
    app = await main;
  });

  it('should implement CORS', async() => {
    const { headers } = await request(app.getHttpServer()).get('/');
    expect(headers['access-control-allow-origin']).toEqual('*');
  });

  afterAll(async () => {
    await app.close();
  });
});