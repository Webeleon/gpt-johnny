import { INestApplication, ValidationPipe } from '@nestjs/common';
import { pgMemDatasource } from './pg-mem-datasource';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

export const getTestingApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DataSource)
    .useValue(pgMemDatasource())
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );
  await app.init();

  return app;
};
