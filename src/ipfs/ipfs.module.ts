import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

import { AuthService } from 'src/auth/auth.service';
import { IpfsService } from './ipfs.service';
import { IpfsController } from './ipfs.controller';

@Module({
  controllers: [IpfsController],
  imports: [JwtModule, UsersModule], // 👈 IMPORT
  providers: [AuthService, IpfsService],
  exports: [AuthService, IpfsService], // 👈 EXPORT
})
export class IpfsModule {}
