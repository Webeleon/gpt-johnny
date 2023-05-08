import { Module } from '@nestjs/common';
import { DiscordClient } from './discord.client';
import { OpenaiModule } from '../openai/openai.module';
import { DiscordMemoryService } from './discord-memory/discord-memory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordMemory } from './discord-memory/discord-memory.entity';

@Module({
  imports: [OpenaiModule, TypeOrmModule.forFeature([DiscordMemory])],
  providers: [DiscordClient, DiscordMemoryService],
})
export class DiscordModule {}
