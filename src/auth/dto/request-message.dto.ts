// src/auth/dto/request-message.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Wallet address is required' })
  @ApiProperty({ example: '0xAbc123...', description: 'Wallet address to sign with' })
  wallet: string;
}
