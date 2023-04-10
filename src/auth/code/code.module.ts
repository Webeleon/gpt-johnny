import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { AuthCode } from './auth-code.entity';
import { UserModule } from '../../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthCode]), UserModule],
  providers: [CodeService],
  controllers: [CodeController],
  exports: [CodeService],
})
export class CodeModule {}
