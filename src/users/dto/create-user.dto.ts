import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsOptional, IsObject } from 'class-validator';

export class CreateUserDto {
  @IsEthereumAddress()
  @ApiProperty({ example: '0xAbc123...', description: 'Wallet address to sign with' })
  wallet_address: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({example: {
  "profile_data": {
    "username": "duong.eth",
    "bio": "Fullstack Web3 Developer",
    "avatar": "https://cdn.example.com/duong-avatar.png"
  }}})
  profile_data?: Record<string, any>;
}
