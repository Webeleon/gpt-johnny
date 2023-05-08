import { Injectable } from '@nestjs/common';
import { DiscordMemory } from './discord-memory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryDto } from '../../openai/dto/history.dto';

@Injectable()
export class DiscordMemoryService {
  constructor(
    @InjectRepository(DiscordMemory)
    private readonly discordMemoryRepository: Repository<DiscordMemory>,
  ) {}

  async getHistory(channel: string): Promise<HistoryDto[]> {
    const history = await this.discordMemoryRepository.find({
      where: {
        channel,
      },
      order: {
        createdAt: 'ASC',
      },
      take: 30,
    });

    return history.map((h) => ({
      name: h.user,
      role: h.role,
      content: h.content,
    }));
  }

  async addHistory(channel: string, history: HistoryDto): Promise<void> {
    await this.discordMemoryRepository.save(
      this.discordMemoryRepository.create({
        channel,
        user: history.name,
        role: history.role,
        content: history.content,
      }),
    );
  }
}
