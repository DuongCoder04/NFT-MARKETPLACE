import { IsEthereumAddress, IsOptional, IsObject } from 'class-validator';

export class CreateUserDto {
  @IsEthereumAddress()
  wallet_address: string;

  @IsOptional()
  @IsObject()
  profile_data?: Record<string, any>;
}
