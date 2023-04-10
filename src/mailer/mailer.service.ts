import { Inject, Injectable, Logger } from '@nestjs/common';
import { mailerConfig } from '../config/mailer.config';
import { ConfigType } from '@nestjs/config';
import { TemplateService } from './template/template.service';
import { appConfig } from '../config/app.config';
import { User } from '../user/user.entity';
import { AuthCode } from '../auth/code/auth-code.entity';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  transporter: Transporter;

  constructor(
    @Inject(mailerConfig.KEY)
    private readonly _mailerConfig: ConfigType<typeof mailerConfig>,
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private readonly templateService: TemplateService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: _mailerConfig.smtpHost,
      port: _mailerConfig.smtpPort,
      secure: _mailerConfig.smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: _mailerConfig.smtpUser, // generated ethereal user
        pass: _mailerConfig.smtpPassword, // generated ethereal password
      },
    });
  }

  async sendEmailVerification(user: User, authCode: AuthCode): Promise<void> {
    try {
      const html = await this.templateService.getConfirmEmailHtml({
        webAppUrl: this._appConfig.webappUrl,
        code: authCode.code,
      });

      const msg = {
        to: user.email,
        from: this._mailerConfig.sender,
        subject: 'Mama Qucha: confirm your email',
        html,
      };

      await this.transporter.sendMail(msg);
    } catch (error: any) {
      Logger.error(error, MailerService.name);
    }
  }

  async sendResetPassword(email: string, code: AuthCode) {
    const html = await this.templateService.getResetPasswordEmail({
      webAppUrl: this._appConfig.webappUrl,
      code: code.code,
    });

    const msg = {
      to: email,
      from: this._mailerConfig.sender,
      subject: 'Mama Qucha: reset your password',
      html,
    };

    await this.transporter.sendMail(msg);
  }
}
