import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './item.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('Items')
@Controller('items')
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createItem(@Body() dto: CreateItemDto) {
    return this.itemsService.createItem(dto);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll() {
    return this.itemsService.getAllItems();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.itemsService.getItemById(id);
  }
}
