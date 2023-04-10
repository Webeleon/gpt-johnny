import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig } from '../config/mailer.config';
import { TemplateService } from './template/template.service';

@Module({
  imports: [ConfigModule.forFeature(mailerConfig)],
  providers: [MailerService, TemplateService],
  exports: [MailerService],
})
export class MailerModule {}
