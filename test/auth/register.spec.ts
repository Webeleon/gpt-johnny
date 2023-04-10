import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getTestingApp } from '../helpers/get-testing-app';

describe('e2e register', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getTestingApp();
  });
  afterEach(async () => {
    await app.close();
  });

  it('register a new user', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'julien@webeleon.dev',
        password: '1234',
        username: 'coco',
      });

    expect(status).toBe(201);
  });

  it('unique username', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'coco@lasticot.test',
      password: '1234',
      username: 'coco',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'coco2@lasticot.test',
        password: '1234',
        username: 'coco',
      });

    expect(response.status).toBe(400);
  });

  it('unique email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'coco3@lasticot.test',
        password: '1234',
        username: 'coco3',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'coco3@lasticot.test',
        password: '1234',
        username: 'marcel',
      });

    expect(response.status).toBe(400);
  });

  const invalidInputs = [
    {
      email: 'coco',
      password: '1234',
      username: 'coco2',
    },
    {
      email: 'coco@lasticot.test',
      password: '1234',
      username: 123,
    },
    {
      password: '1234',
      username: 'coco2',
    },
    {
      email: 'coco@lasticot.test',
      username: 'coco2',
    },
    {
      email: 'coco@lasticot.test',
      password: '1234',
    },
    {},
  ];

  for (const input of invalidInputs) {
    it(`input validation: ${JSON.stringify(input)}`, async () => {
      const { status } = await request(app.getHttpServer())
        .post('/auth/register')
        .send(input);
      expect(status).toBe(400);
    });
  }
});
