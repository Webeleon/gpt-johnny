import { Controller, Get } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './user.entity';

@Controller('user')
@JwtGuard()
export class UserController {
  @Get('profile')
  getUser(@GetUser() user: User) {
    return user;
  }
}
