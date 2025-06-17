import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':wallet_address')
  async getUser(@Param('wallet_address') wallet_address: string) {
    return this.usersService.findOne(wallet_address);
  }

  @Put(':wallet_address')
  async updateUser(
    @Param('wallet_address') wallet_address: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(wallet_address, dto);
  }
}
