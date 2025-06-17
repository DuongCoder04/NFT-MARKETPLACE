// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  findByWallet(wallet: string) {
    return this.userRepo.findOne({ where: { wallet_address: wallet } });
  }

  async create(wallet: string) {
    const user = this.userRepo.create({ wallet_address: wallet });
    return this.userRepo.save(user);
  }
}
