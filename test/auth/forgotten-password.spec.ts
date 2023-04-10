import { INestApplication } from '@nestjs/common';
import { getTestingApp } from '../helpers/get-testing-app';
import * as request from 'supertest';
import { AuthCode } from '../../src/auth/code/auth-code.entity';
import { CodeType } from '../../src/auth/code/code-type.enum';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('e2e forgotten password', () => {
  let app: INestApplication;
  let authCodeRepository: Repository<AuthCode>;

  beforeEach(async () => {
    app = await getTestingApp();
    authCodeRepository = app.get<Repository<AuthCode>>(
      getRepositoryToken(AuthCode),
    );
  });
  afterEach(async () => {
    await app.close();
  });

  it('[full scenario] request a password reset on a registered user', async () => {
    // register and confirm user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'coco@lasticot.bzh',
        password: '1234',
        username: 'coco',
      })
      .expect(201);

    const code = await authCodeRepository.findBy({
      user: {
        id: registerResponse.body.id,
      },
    });

    await request(app.getHttpServer()).get(
      `/auth/code/email-verification?code=${code[0].code}`,
    );

    // start the forgotten password workflow
    await request(app.getHttpServer())
      .post('/auth/forgotten-password')
      .send({
        email: 'coco@lasticot.bzh',
      })
      .expect(200);

    const resetCode = await authCodeRepository.findOneBy({
      user: {
        id: registerResponse.body.id,
      },
      codeType: CodeType.RESET_PASSWORD,
    });
    expect(resetCode).toBeDefined();

    await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        password: 'asdasd',
        code: resetCode.code,
      })
      .expect(200);

    // can only be used once
    await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        password: 'asdasd',
        code: resetCode.code,
      })
      .expect(400);

    const usedResetCode = await authCodeRepository.findOneBy({
      user: {
        id: registerResponse.body.id,
      },
      codeType: CodeType.RESET_PASSWORD,
    });
    expect(usedResetCode).toBeDefined();
    expect(usedResetCode.used).toBe(true);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'coco@lasticot.bzh',
        password: '1234',
      })
      .expect(401);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'coco@lasticot.bzh',
        password: 'asdasd',
      })
      .expect(200);
  });
});
