// src/users/users.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User{
    @PrimaryColumn()
    wallet_address: string;

    @Column({type: 'jsonb', nullable: true})
    profile_data: Record<string, any>;

    @CreateDateColumn()
    created_at: Date;
}

