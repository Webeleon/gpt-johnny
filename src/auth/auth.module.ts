import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { authConfig } from '../config/auth.config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CodeModule } from './code/code.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: ConfigType<typeof authConfig>) => {
        return {
          secret: config.jwtSecret,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    MailerModule,
    CodeModule,
  ],
  providers: [LocalStrategy, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
