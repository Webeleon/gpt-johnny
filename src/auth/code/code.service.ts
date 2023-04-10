import { Injectable } from '@nestjs/common';
import { AuthCode } from './auth-code.entity';
import { User } from '../../user/user.entity';
import { AuthCodeNotFoundException } from './exception/auth-code-not-found.exception';
import { AuthCodeAlreadyUsedException } from './exception/auth-code-already-used.exception';
import { UserService } from '../../user/user.service';
import { CodeType } from './code-type.enum';
import { NoUserNoAuthCodeException } from './exception/no-user-no-auth-code.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(AuthCode)
    private readonly authCodeRepository: Repository<AuthCode>,
    private readonly userService: UserService,
  ) {}

  private generateRandomCode(): string {
    return Math.round(Math.random() * 1000000000000).toString(16);
  }

  async generateEmailConfirmationCode(user: User): Promise<AuthCode> {
    const code = this.authCodeRepository.create({
      user: user,
      code: this.generateRandomCode(),
      codeType: CodeType.CONFIRM_EMAIL,
    });
    await this.authCodeRepository.save(code);
    return code;
  }

  async generateResetPasswordCode(email: string): Promise<AuthCode> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NoUserNoAuthCodeException();
    }

    const code = this.authCodeRepository.create({
      user: user,
      code: this.generateRandomCode(),
      codeType: CodeType.RESET_PASSWORD,
    });
    await this.authCodeRepository.save(code);
    return code;
  }

  async getResetPasswordCode(code: string): Promise<AuthCode> {
    const authCode = await this.authCodeRepository.findOneBy({
      code,
      codeType: CodeType.RESET_PASSWORD,
    });

    if (!authCode) {
      throw new AuthCodeNotFoundException();
    }
    if (authCode.used) {
      throw new AuthCodeAlreadyUsedException();
    }

    return authCode;
  }

  async markCodeAsUsed(code: string) {
    await this.authCodeRepository.update(
      {
        code,
      },
      {
        used: true,
      },
    );
  }

  async validateEmailConfirmationCode(codeToValidate: string): Promise<void> {
    const authCode = await this.authCodeRepository.findOneBy({
      code: codeToValidate,
      codeType: CodeType.CONFIRM_EMAIL,
    });

    if (!authCode) {
      throw new AuthCodeNotFoundException();
    }
    if (authCode.used) {
      throw new AuthCodeAlreadyUsedException();
    }

    authCode.used = true;
    await this.authCodeRepository.save(authCode);
    await this.userService.markEmailAsConfirmed(authCode.user.id);
  }
}
