// src/auth/dto/signature-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class SignatureRequestDto {
  @IsEthereumAddress()
  @IsString()
  @ApiProperty({ example: '0xAbc123...', description: 'Wallet address to sign with' })
  wallet!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '0xSignature...', description: 'Nonce to sign' })
  nonce!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '0xPrivateKey...', description: 'Private key to sign the nonce' })
  privateKey!: string;
}
