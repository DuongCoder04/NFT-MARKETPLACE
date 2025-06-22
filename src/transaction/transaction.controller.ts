import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transaction.service';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) { }

  @Get()
  async getAll() {
    return await this.txService.findAll();
  }
  @Get(':wallet')
  async getByWallet(@Param('wallet') wallet: string) {
    return this.txService.getTransactionsByWallet(wallet);
  }

}
