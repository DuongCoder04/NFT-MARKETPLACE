import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Transactions')
@Controller('transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll() {
    return await this.txService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':wallet')
  async getByWallet(@Param('wallet') wallet: string) {
    return this.txService.getTransactionsByWallet(wallet);
  }

}
