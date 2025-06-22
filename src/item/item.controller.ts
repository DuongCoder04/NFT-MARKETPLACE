import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './item.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  createItem(@Body() dto: CreateItemDto) {
    return this.itemsService.createItem(dto);
  }

  @Get()
  getAll() {
    return this.itemsService.getAllItems();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.itemsService.getItemById(id);
  }
}
