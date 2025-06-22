import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing } from "./listing.entity";
import { Repository } from "typeorm";
import { Item } from "src/item/item.entity";
import { TokenService } from "src/blockchain/token.service";
import { TransactionsService } from "src/transaction/transaction.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { BuyItemDto } from "./dto/buy-item.dto";

@Injectable()
export class ListingService {
    constructor(
        @InjectRepository(Listing) private listingRepo: Repository<Listing>,
        @InjectRepository(Item) private itemRepo: Repository<Item>,
        private tokenService: TokenService,
        private txService: TransactionsService,
    ) { }

    async create(dto: CreateListingDto) {
        const item = await this.itemRepo.findOneBy({ id: dto.itemId });
        if (!item) throw new BadRequestException('Item not found');

        // Chỉ cho phép người sở hữu list sản phẩm
        const seller = item.owner;

        const listing = this.listingRepo.create({
            item,
            seller,
            price: dto.price,
        });

        return this.listingRepo.save(listing);
    }

    async buy(listingId: number, dto: BuyItemDto) {
        const listing = await this.listingRepo.findOne({
            where: { id: listingId },
            relations: ['item'],
        });

        if (!listing || listing.status !== 'active') {
            throw new BadRequestException('Listing not available');
        }

        if (listing.seller === dto.buyer) {
            throw new BadRequestException('Cannot buy your own item');
        }

        // ✅ Gửi token từ buyer đến seller
        const txHash = await this.tokenService.transferToken({
            to: listing.seller,
            amount: listing.price,
        });

        // ✅ Cập nhật ownership trong DB
        listing.status = 'sold';
        listing.item.owner = dto.buyer;

        await this.itemRepo.save(listing.item);
        await this.listingRepo.save(listing);

        // ✅ Log giao dịch
        await this.txService.logTransaction({
            hash: txHash.hash,
            from: dto.buyer,
            to: listing.seller,
            amount: listing.price,
            type: 'purchase',
            status: 'success',
            explorer: `https://testnet.bscscan.com/tx/${txHash.hash}`,
        });

        return { message: 'Purchase successful', txHash };
    }
}
