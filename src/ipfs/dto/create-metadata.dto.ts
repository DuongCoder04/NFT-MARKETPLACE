import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AttributeDto {
  @ApiProperty({ example: 'Background' })
  @IsNotEmpty()
  @IsString()
  trait_type!: string;

  @ApiProperty({ example: 'Blue' })
  @IsNotEmpty()
  @IsString()
  value!: string;
}

export class CreateMetadataDto {
  @ApiProperty({ example: 'Cool NFT #1' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'This is a super cool NFT with unique attributes.' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 'https://ipfs.io/ipfs/QmImageHash1234' })
  @IsNotEmpty()
  @IsString()
  image!: string; // IPFS image URL

  @ApiPropertyOptional({
    description: 'NFT attributes (optional)',
    type: [AttributeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes?: AttributeDto[];
}
