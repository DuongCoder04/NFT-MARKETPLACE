import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemsService } from './item.service';
import { ItemsController } from './item.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule { }
