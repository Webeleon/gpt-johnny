import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { discordConfig } from '../config/discord.config';
import { Client, GatewayIntentBits } from 'discord.js';
import { OpenaiService } from '../openai/openai.service';
import { DiscordMemoryService } from './discord-memory/discord-memory.service';

@Injectable()
export class DiscordClient {
  public readonly client: Client;

  constructor(
    @Inject(discordConfig.KEY)
    private readonly config: ConfigType<typeof discordConfig>,
    private readonly openaiService: OpenaiService,
    private readonly discordMemoryService: DiscordMemoryService,
  ) {
    Logger.log(
      `Invitation link: ${this.getInvitationLink()}`,
      'DiscordService',
    );

    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      presence: {
        activities: [
          {
            name: 'ask me anything!',
          },
        ],
        status: 'online',
      },
    });
  }

  public async start(): Promise<void> {
    await this.client.login(this.config.botToken);

    this.client.on('ready', () => {
      Logger.log(`Logged in as ${this.client.user.tag}!`, 'DiscordService');
    });

    this.registerOnMessage();
  }

  private registerOnMessage() {
    this.client.on('messageCreate', async (msg) => {
      if (msg.channel.id !== '862256513372520458') {
        return;
      }

      Logger.debug(`messageCreate: ${msg.cleanContent}`, 'DiscordService');
      msg.channel.sendTyping();
      if (!msg.author.bot && msg.cleanContent.length > 0) {
        const history = await this.discordMemoryService.getHistory(
          msg.channel.id.toString(),
        );

        const response = await this.openaiService.chat(
          msg.cleanContent,
          msg.author.id,
          history,
        );
        if (response.length > 2000) {
          Logger.warn(
            `response too long: ${response.length}`,
            'DiscordService',
          );
        }
        await this.discordMemoryService.addHistory(msg.channel.id.toString(), {
          role: 'user',
          name: msg.author.id,
          content: msg.cleanContent,
        });
        await this.discordMemoryService.addHistory(msg.channel.id.toString(), {
          role: 'assistant',
          name: 'johnny-gpt',
          content: response,
        });
        await msg.channel.send(response);
      }
    });
  }

  private getInvitationLink(): string {
    return `https://discord.com/oauth2/authorize?client_id=${this.config.clientId}&scope=bot&permissions=${this.config.permission}`;
  }
}
