import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestingApp } from '../helpers/get-testing-app';

describe('Health e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getTestingApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('ok');
  });
});
