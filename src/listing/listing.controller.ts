import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ListingService } from "./listing.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { BuyItemDto } from "./dto/buy-item.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

// src/listing/listing.controller.ts

@ApiTags('Listing')
@ApiBearerAuth()
@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateListingDto) {
    return this.listingService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/buy')
  buy(@Param('id', ParseIntPipe) id: number, @Body() dto: BuyItemDto) {
    return this.listingService.buy(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiResponse({ status: 200, description: 'Danh sách tất cả listing' })
  findAll() {
    return this.listingService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wallet/:wallet')
  @ApiResponse({ status: 200, description: 'Danh sách listing của ví' })
  findByWallet(@Param('wallet') wallet: string) {
    return this.listingService.findByWallet(wallet);
  }
}
