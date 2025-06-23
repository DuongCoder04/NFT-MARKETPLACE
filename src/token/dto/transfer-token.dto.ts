// src/token/dto/transfer-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class TransferTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0x1234...', description: 'The address of the sender' })
  to!: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ example: '100', description: 'The amount of tokens to transfer' })
  amount!: string;
}
