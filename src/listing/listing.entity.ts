// src/listing/listing.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Item } from '../item/item.entity';

@Entity()
export class Listing {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Item, item => item.listings)
    item!: Item;

    @Column()
    seller!: string; // wallet address

    @Column()
    price!: string;

    @Column({ default: 'active' })
    status!: 'active' | 'sold';

    @CreateDateColumn()
    createdAt!: Date;
}
