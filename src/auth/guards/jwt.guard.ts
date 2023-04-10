import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const JwtGuard = () => UseGuards(AuthGuard('jwt'));
