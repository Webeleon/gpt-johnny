import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  webappUrl: process.env.WEBAPP_URL || 'http://localhost:3000',
  openAIKey: process.env.OPENAI_KEY,
}));
