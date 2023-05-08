import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { RequestLoggerMiddleware } from './request-logger.middleware';
import { UserModule } from './user/user.module';
import { authConfig } from './config/auth.config';
import { MailerModule } from './mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiModule } from './openai/openai.module';
import { DiscordModule } from './discord/discord.module';
import { discordConfig } from './config/discord.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, discordConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (config) => ({
        ...config,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    HealthModule,
    AuthModule,
    UserModule,
    MailerModule,
    OpenaiModule,
    DiscordModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestLoggerMiddleware).exclude('/').forRoutes('*');
  }
}
