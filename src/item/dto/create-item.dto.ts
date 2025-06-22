import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
    @IsString()
    @ApiProperty({ example: 'Cool NFT Item' })
    name!: string;

    @IsString()
    @ApiProperty({ example: 'This is a cool NFT item that you can buy.' })
    description!: string;

    @ApiProperty({ example: '0x1234...' })
    @IsString()
    owner!: string;

    @ApiProperty({ example: 'ipfs://Qm.../metadata.json' })
    @IsString()
    metadata_uri!: string;

    @ApiProperty({ example: 'https://ipfs.io/ipfs/Qm.../image.png' })
    @IsString()
    image_url!: string;
}
