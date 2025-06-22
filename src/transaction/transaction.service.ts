import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly txRepo: Repository<Transaction>,
    ) { }

    async logTransaction(data: {
        hash: string;
        from: string;
        to: string;
        amount: string;
        type: 'mint' | 'transfer' | 'purchase';
        status?: 'success' | 'pending' | 'failed';
        explorer?: string;
    }) {
        const tx = this.txRepo.create({
            hash: data.hash,
            fromAddress: data.from,
            toAddress: data.to,
            amount: parseFloat(data.amount),
            type: data.type,
            status: data.status || 'success',
            explorer: `https://testnet.bscscan.com/tx/${data.hash}`,
        });

        return await this.txRepo.save(tx);
    }


    async findAll(): Promise<Transaction[]> {
        return this.txRepo.find({ order: { createdAt: 'DESC' } });
    }

    async getTransactionsByWallet(walletAddress: string): Promise<Transaction[]> {
        return this.txRepo.find({
            where: [
                { fromAddress: walletAddress },
                { toAddress: walletAddress },
            ],
            order: { createdAt: 'DESC' },
        });
    }
}
