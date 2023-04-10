import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { ConfigType } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Starter API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  Logger.log(`swagger available on /swagger and /swagger-json`, 'MAIN');

  // setup validation
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );

  // security
  app.use(helmet());
  app.enableCors();

  // limit
  app.use(
    json({
      limit: '100mb',
    }),
  );

  // start the api
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  await app.listen(config.port, '0.0.0.0');
  Logger.log(`API started on port ${config.port}`, 'MAIN');
}
bootstrap();
