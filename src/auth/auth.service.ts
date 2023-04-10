import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { comparePassword, hashPassword } from './hash-password';
import { RegisterDto } from './dto/register.dto';
import { LoginAccessTokenDto } from './dto/login-access-token.dto';
import { JwtService } from '@nestjs/jwt';
import { CodeService } from './code/code.service';
import { MailerService } from '../mailer/mailer.service';
import { ForgottenPasswordDto } from './dto/forgotten-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly codeService: CodeService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await comparePassword(password, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginAccessTokenDto> {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
      }),
      validEmail: user.validEmail,
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.userService.createUser({
      email: registerDto.email,
      username: registerDto.username,
      passwordHash: await hashPassword(registerDto.password),
    });

    await this.mailerService.sendEmailVerification(
      user,
      await this.codeService.generateEmailConfirmationCode(user),
    );

    return user;
  }

  async forgottenPassword(
    forgottenPasswordDto: ForgottenPasswordDto,
  ): Promise<void> {
    await this.mailerService.sendResetPassword(
      forgottenPasswordDto.email,
      await this.codeService.generateResetPasswordCode(
        forgottenPasswordDto.email,
      ),
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const code = await this.codeService.getResetPasswordCode(
      resetPasswordDto.code,
    );
    await this.userService.updatePasswordHash(
      code.user.id,
      await hashPassword(resetPasswordDto.password),
    );
    await this.codeService.markCodeAsUsed(code.code);
  }
}
