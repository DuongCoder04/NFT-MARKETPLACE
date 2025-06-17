// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: '0xAbc123...', description: 'Wallet address to sign with' })
  wallet: string;

  @IsString()
  @ApiProperty({ example: '0xAbc123...', description: 'Your signature' })
  signature: string;
}
