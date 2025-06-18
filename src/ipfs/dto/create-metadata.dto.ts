import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class AttributeDto {
  @IsNotEmpty()
  @IsString()
  trait_type: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class CreateMetadataDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string; // IPFS image URL

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes?: AttributeDto[];
}
