import { registerAs } from '@nestjs/config';

export const discordConfig = registerAs('discord', () => ({
  applicationId: process.env.DISCORD_APPLICATION_ID ?? '',
  publicKey: process.env.DISCORD_PUBLIC_KEY ?? '',
  permission: process.env.DISCORD_PERMISSION ?? '',
  botToken: process.env.DISCORD_BOT_TOKEN ?? '',
  clientId: process.env.DISCORD_CLIENT_ID ?? '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
}));
