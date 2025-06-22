import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

import { AuthService } from 'src/auth/auth.service';
import { IpfsService } from './ipfs.service';
import { IpfsController } from './ipfs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './nft.entity';
import { Image } from './image.entity';


@Module({
  controllers: [IpfsController],
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Image, Nft])], // 👈 IMPORT
  providers: [AuthService, IpfsService],
  exports: [AuthService, IpfsService],
})
export class IpfsModule { }
