
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
// nft.entity.ts
@Entity()
export class Nft {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    metadata_uri!: string;

    @Column({ nullable: true })
    token_id!: number;

    @Column({ nullable: true })
    contract_address!: string;

    @Column({ nullable: true })
    current_owner!: string;

    @Column({ nullable: true })
    collection_id!: number;

    @CreateDateColumn()
    created_at!: Date;
}
