import { registerAs } from '@nestjs/config';

export const mailerConfig = registerAs('mailer', () => ({
  sender: process.env.MAIL_SENDER || 'contact@webeleon.dev',
  smtpHost: process.env.SMTP_HOST || '0.0.0.0',
  smtpPort: parseInt(process.env.SMTP_PORT) || 1025,
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
}));
