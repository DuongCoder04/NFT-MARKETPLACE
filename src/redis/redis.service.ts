import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis'; // ✅ default import

@Injectable()
export class RedisService implements OnModuleInit {
    private client!: Redis;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const host = this.configService.get<string>('REDIS_HOST', '127.0.0.1');
        const port = this.configService.get<number>('REDIS_PORT', 6379);
        const password = this.configService.get<string>('REDIS_PASSWORD');

        this.client = new Redis({
            host,
            port,
            password,
        });

        this.client.on('connect', () => {
            console.log('✅ Redis connected');
        });

        this.client.on('error', (err) => {
            console.error('❌ Redis error', err);
        });
    }

    async set(key: string, value: string, ttlSeconds = 300): Promise<'OK'> {
        return this.client.set(key, value, 'EX', ttlSeconds);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async del(key: string): Promise<number> {
        return this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }
}
