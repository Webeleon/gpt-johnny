import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as mjml from 'mjml';
import { AuthCodeDataInterface } from './auth-code-data.interface';
import { promises as fs } from 'fs';

@Injectable()
export class TemplateService {
  compileTemplate<Data = Record<string, string>>(
    template: string,
    data: Data,
  ): Promise<string> {
    const mjmlString = ejs.render(template, data);
    const compiledMjml = mjml(mjmlString, {});

    return compiledMjml.html;
  }

  async loadEJSTemplate(path: string): Promise<string> {
    const template = await fs.readFile(path);
    return template.toString('utf-8');
  }

  async getConfirmEmailHtml(data: AuthCodeDataInterface): Promise<string> {
    const template = await this.loadEJSTemplate(
      __dirname + '/../../../templates/confirm-email.mjml.ejs',
    );
    return this.compileTemplate<AuthCodeDataInterface>(template, data);
  }

  async getResetPasswordEmail(data: AuthCodeDataInterface): Promise<string> {
    const template = await this.loadEJSTemplate(
      __dirname + '/../../../templates/reset-password.mjml.ejs',
    );
    return this.compileTemplate<AuthCodeDataInterface>(template, data);
  }
}
