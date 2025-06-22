import { Body, Controller, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ListingService } from "./listing.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { BuyItemDto } from "./dto/buy-item.dto";

// src/listing/listing.controller.ts
@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) { }

  @Post()
  create(@Body() dto: CreateListingDto) {
    return this.listingService.create(dto);
  }

  @Post(':id/buy')
  buy(@Param('id', ParseIntPipe) id: number, @Body() dto: BuyItemDto) {
    return this.listingService.buy(id, dto);
  }
}
