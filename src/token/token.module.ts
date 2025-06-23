import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from 'src/token/token.controller';

import { TokenService } from 'src/token/token.service';
import { TransactionsModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule,
    TransactionsModule,
    TypeOrmModule.forFeature([]), // nếu cần dùng trong service này
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService], // Exports TokenService for use in other modules
})
export class TokenModule { }
