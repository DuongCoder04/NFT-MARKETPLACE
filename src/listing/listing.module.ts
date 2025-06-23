import { forwardRef, Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { Item } from 'src/item/item.entity';
import { TokenModule } from 'src/token/token.module';
import { TransactionsModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, Item]),
    forwardRef(() => TokenModule),        // 👈 Nếu TokenModule cũng import ListingModule
    forwardRef(() => TransactionsModule), // 👈 Nếu TransactionsModule cũng import ListingModule
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService], // 👈 Cho phép module khác sử dụng ListingService
})
export class ListingModule { }
