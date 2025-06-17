import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createIfNotExists(wallet_address: string): Promise<User> {
    let user = await this.usersRepository.findOneBy({ wallet_address });
    if (!user) {
      user = this.usersRepository.create({ wallet_address });
      await this.usersRepository.save(user);
    }
    return user;
  }

  async findOne(wallet_address: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ wallet_address });
    if (!user) {
      throw new Error(`User with wallet address ${wallet_address} not found`);
    }
    return user;
  }

  async update(wallet_address: string, dto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update({ wallet_address }, dto);
    return this.findOne(wallet_address);
  }
}
