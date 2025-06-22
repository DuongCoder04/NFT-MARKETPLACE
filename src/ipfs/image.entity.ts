// image.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ipfs_hash!: string;

    @Column({ nullable: true })
    file_name!: string;

    @Column({ nullable: true })
    file_type!: string;

    @CreateDateColumn()
    created_at!: Date;
}
