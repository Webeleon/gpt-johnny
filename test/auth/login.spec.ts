import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestingApp } from '../helpers/get-testing-app';

describe('e2e login', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getTestingApp();
  });
  afterEach(async () => {
    await app.close();
  });

  it('login with valid email/password', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'coco@lasticot.test',
        password: '1234',
        username: 'coco',
      })
      .expect(201);
    const { status, body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'coco@lasticot.test',
        password: '1234',
      });
    expect(status).toBe(200);
    expect(body.access_token).toBeDefined();
    expect(body.access_token.length).toBeGreaterThan(1);
  });

  it('reject login with invalid email/password', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'coco@lasticot.test',
        password: '12345',
      });
    expect(status).toBe(401);
  });
});
