import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    hash!: string;

    @Column({ name: 'from_address' })
    fromAddress!: string;

    @Column({ name: 'to_address' })
    toAddress!: string;

    @Column('numeric')
    amount!: number;

    @Column()
    type!: 'mint' | 'transfer' | 'purchase';

    @Column({ default: 'success' })
    status!: 'pending' | 'success' | 'failed';

    @Column({ nullable: true })
    explorer!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
