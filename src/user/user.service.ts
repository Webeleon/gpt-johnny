import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ExistingUserException } from './exception/existing-user.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ExistingUserException();
      }
      throw error;
    }
  }

  async markEmailAsConfirmed(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    user.validEmail = true;
    await this.userRepository.save(user);
  }

  async updatePasswordHash(id: string, passwordHash: string) {
    const user = await this.userRepository.findOneBy({ id });
    user.passwordHash = passwordHash;
    await this.userRepository.save(user);
  }
}
