import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../user/user.entity';
import { LocalGuard } from './guards/local.guard';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ExistingUserException } from '../user/exception/existing-user.exception';
import { ForgottenPasswordDto } from './dto/forgotten-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthCodeNotFoundException } from './code/exception/auth-code-not-found.exception';
import { AuthCodeAlreadyUsedException } from './code/exception/auth-code-already-used.exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error: any) {
      if (error instanceof ExistingUserException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(200)
  @LocalGuard()
  login(@Body() login: LoginDto, @GetUser() user: User) {
    return this.authService.login(user);
  }

  @Post('forgotten-password')
  @HttpCode(200)
  async forgottenPassword(@Body() forgottenPasswordDto: ForgottenPasswordDto) {
    try {
      await this.authService.forgottenPassword(forgottenPasswordDto);
    } catch (error: any) {
      Logger.error(error, 'Forgotten password controller');
    }
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(resetPasswordDto);
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
  }
}
