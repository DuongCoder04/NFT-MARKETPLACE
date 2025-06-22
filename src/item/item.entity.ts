import { Listing } from 'src/listing/listing.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description!: string;

    @Column()
    owner!: string; // wallet address

    @Column()
    metadata_uri!: string; // link IPFS của metadata JSON

    @Column()
    image_url!: string; // ảnh minh họa (có thể là IPFS gateway URL)

    @OneToMany(() => Listing, listing => listing.item)
    listings!: Listing[];

    @CreateDateColumn()
    created_at!: Date;
}
