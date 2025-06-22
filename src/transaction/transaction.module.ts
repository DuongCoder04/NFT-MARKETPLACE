import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService], // nếu cần dùng ở service khác
})
export class TransactionsModule { }
