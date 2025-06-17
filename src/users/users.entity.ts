// src/users/users.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User{
    @PrimaryColumn()
    wallet_address: string;

    @Column({ nullable: true })
    display_name: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ nullable: true })
    bio: string;

    @CreateDateColumn()
    created_at: Date;
}

