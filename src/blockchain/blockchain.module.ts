import { Module } from '@nestjs/common';
import { TokenService } from './token.service';


@Module({
  providers: [TokenService],
  exports: [TokenService], // 👈 cho phép module khác sử dụng
})
export class BlockchainModule { }
