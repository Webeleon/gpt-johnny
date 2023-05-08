import { Inject, Injectable, Logger } from '@nestjs/common';
import { appConfig } from '../config/app.config';
import { ConfigType } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { HistoryDto } from './dto/history.dto';

@Injectable()
export class OpenaiService {
  private openai: OpenAIApi;

  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: this.config.openAIKey,
      }),
    );
  }

  async chat(
    prompt: string,
    userId: string,
    history: HistoryDto[] = [],
  ): Promise<string> {
    Logger.debug(`chat: ${prompt}`, 'OpenaiService');
    const messages: HistoryDto[] = [
      {
        role: 'system',
        content: `The current date is: ${new Date().toLocaleDateString()}`,
      },
      {
        role: 'system',
        content: `You are a usefull assistant named Johnny GPT living on a programming discord server named Webeleon Community. You help people with technical advices.`,
      },
      {
        role: 'system',
        content: 'you respond in the language used by the user.',
      },
      ...history,
      {
        role: 'user',
        content: prompt,
      },
    ];
    const completion = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      user: userId,
      messages,
    });
    Logger.debug(
      JSON.stringify(completion.data, undefined, 2),
      'OpenaiService',
    );
    return completion.data.choices[0].message.content;
  }
}
