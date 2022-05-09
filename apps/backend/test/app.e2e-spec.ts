import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PiesStub, PieStub } from '../src/pies/test/stubs/pies.stubs';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello from PieDAO!');
  });

  it('/pies/all (GET)', async() => {
    const response = await request(app.getHttpServer()).get('/pies/all');
    let piesMock = PiesStub();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({name: piesMock[0].name, address: piesMock[0].address.toLowerCase()}),
        expect.objectContaining({name: piesMock[1].name, address: piesMock[1].address.toLowerCase()}),
        expect.objectContaining({name: piesMock[2].name, address: piesMock[2].address.toLowerCase()}),
        expect.objectContaining({name: piesMock[3].name, address: piesMock[3].address.toLowerCase()}),
        expect.objectContaining({name: piesMock[4].name, address: piesMock[4].address.toLowerCase()}),
        expect.objectContaining({name: piesMock[5].name, address: piesMock[5].address.toLowerCase()}),
        expect.objectContaining({name: piesMock[6].name, address: piesMock[6].address.toLowerCase()}),
        expect.objectContaining({name: piesMock[7].name, address: piesMock[7].address.toLowerCase()})
      ])      
    );
  });  

  it('/pies/address (GET)', async() => {
    const response = await request(app.getHttpServer()).get('/pies/address/0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({name: PieStub().name, address: PieStub().address.toLowerCase()})
    );
  });  

  it('/pies/name (GET)', async() => {
    const response = await request(app.getHttpServer()).get('/pies/name/BTC%2B%2B');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({name: PieStub().name, address: PieStub().address.toLowerCase()})
    );
  });  
  
  it('/pies/history (GET)', async() => {
    const response = await request(app.getHttpServer()).get('/pies/history?address=0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd');
    
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("object");
  }); 
  
  afterAll(async () => {
    await app.close();
  });  
});
