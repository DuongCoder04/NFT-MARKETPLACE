import { Module } from '@nestjs/common';
import { TokenController } from 'src/blockchain/token.controller';

import { TokenService } from 'src/blockchain/token.service';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule { }
