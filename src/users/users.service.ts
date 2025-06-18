import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Tạo user nếu chưa tồn tại
   */
  async createIfNotExists(wallet_address: string): Promise<User> {
    const lowerWallet = wallet_address.toLowerCase();

    let user = await this.usersRepository.findOneBy({ wallet_address: lowerWallet });
    if (!user) {
      user = this.usersRepository.create({ wallet_address: lowerWallet });
      await this.usersRepository.save(user);
    }
    return user;
  }

  /**
   * Lấy user theo ví
   */
  async findOne(wallet_address: string): Promise<User> {
    const lowerWallet = wallet_address.toLowerCase();
    const user = await this.usersRepository.findOneBy({ wallet_address: lowerWallet });

    if (!user) {
      throw new NotFoundException(`User with wallet address ${wallet_address} not found`);
    }

    return user;
  }

  /**
   * Cập nhật user
   */
  async update(wallet_address: string, dto: UpdateUserDto): Promise<User> {
    const lowerWallet = wallet_address.toLowerCase();
    await this.usersRepository.update({ wallet_address: lowerWallet }, dto);
    return this.findOne(lowerWallet);
  }

  /**
   * Xoá user
   */
  async remove(wallet_address: string): Promise<boolean> {
    const lowerWallet = wallet_address.toLowerCase();
    const result = await this.usersRepository.delete({ wallet_address: lowerWallet });
    return (result.affected ?? 0) > 0;

  }
}
