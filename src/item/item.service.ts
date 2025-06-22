import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
    ) { }

    async createItem(dto: CreateItemDto): Promise<Item> {
        const item = this.itemRepository.create(dto);
        return this.itemRepository.save(item);
    }

    async getAllItems(): Promise<Item[]> {
        return this.itemRepository.find();
    }

    async getItemById(id: number): Promise<Item> {
        if (!id) {
            throw new Error('Item ID is required');
        }
        const item = await this.itemRepository.findOneBy({ id });
        if (!item) {
            throw new Error(`Item with ID ${id} not found`);
        }
        return item;
    }
}
