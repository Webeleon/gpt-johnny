import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CodeService } from './code.service';
import { AuthCodeNotFoundException } from './exception/auth-code-not-found.exception';
import { AuthCodeAlreadyUsedException } from './exception/auth-code-already-used.exception';

@Controller('auth/code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}
  @Get('email-verification')
  async emailVerification(@Query('code') code: string) {
    try {
      await this.codeService.validateEmailConfirmationCode(code);
    } catch (error) {
      if (error instanceof AuthCodeNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof AuthCodeAlreadyUsedException) {
        throw new BadRequestException(error.message);
      }
      Logger.error(error, 'CodeController');
      throw error;
    }
    return { ok: 'ok' };
  }
}
