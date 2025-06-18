import { Controller, Get, Param, Put, Body, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':wallet_address')
  async getUser(@Param('wallet_address') wallet_address: string) {
    return this.usersService.findOne(wallet_address);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':wallet_address')
  async updateUser(
    @Param('wallet_address') wallet_address: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(wallet_address, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':wallet')
  async deleteUser(@Param('wallet') wallet: string) {
    const result = await this.usersService.remove(wallet);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
