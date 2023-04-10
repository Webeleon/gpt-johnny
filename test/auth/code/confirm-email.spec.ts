import { INestApplication } from '@nestjs/common';
import { getTestingApp } from '../../helpers/get-testing-app';
import * as request from 'supertest';
import { AuthCode } from '../../../src/auth/code/auth-code.entity';
import { User } from '../../../src/user/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('e2e confirm email', () => {
  let app: INestApplication;
  let authCodeRepository: Repository<AuthCode>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    app = await getTestingApp();
    authCodeRepository = app.get<Repository<AuthCode>>(
      getRepositoryToken(AuthCode),
    );
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });
  afterEach(async () => {
    await app.close();
  });

  it('validate email', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'coco@lasticot.bzh',
        password: '1234',
        username: 'coco',
      })
      .expect(201);

    const code = await authCodeRepository.find({
      where: {
        user: {
          id: registerResponse.body.id,
        },
      },
    });

    const { status } = await request(app.getHttpServer()).get(
      `/auth/code/email-verification?code=${code[0].code}`,
    );

    expect(status).toBe(200);

    const user = await userRepository.findOne({
      where: {
        id: registerResponse.body.id,
      },
    });

    expect(user.validEmail).toBe(true);
  });
});
