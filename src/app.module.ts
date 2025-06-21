import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IpfsModule } from './ipfs/ipfs.module';

import { User } from './users/users.entity';

import { TokenController } from './blockchain/token.controller';
import { TokenService } from './blockchain/token.service';
import { TokenModule } from './blockchain/token.module';

@Module({
  imports: [
    // Load biến môi trường toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Kết nối PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: parseInt(config.get<string>('DATABASE_PORT') || '5432', 10),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [User],
        synchronize: true,
        logging: true,
      }),
    }),

    // Đăng ký các entity riêng
    TypeOrmModule.forFeature([User]),

    // Đăng ký JWT từ biến môi trường
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h',
        },
      }),
      inject: [ConfigService],
    }),

    // Các module tính năng
    AuthModule,
    UsersModule,
    IpfsModule,
    TokenModule
  ],
  controllers: [AppController, TokenController],
  providers: [AppService, TokenService],
})
export class AppModule { }
