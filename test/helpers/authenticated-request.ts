import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const getAuthenticatedRequest = async (app: INestApplication) => {
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({
      email: 'coco@lasticot.test',
      password: '1234',
      username: 'coco',
    })
    .expect(201);

  const { body } = await request(app.getHttpServer()).post('/auth/login').send({
    email: 'coco@lasticot.test',
    password: '1234',
  });

  return {
    get: (path: string) =>
      request(app.getHttpServer())
        .get(path)
        .set('Authorization', `Bearer ${body.access_token}`),
  };
};
