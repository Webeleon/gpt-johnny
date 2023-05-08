export class HistoryDto {
  role: 'user' | 'system' | 'assistant';
  content: string;
  name?: string;
}
