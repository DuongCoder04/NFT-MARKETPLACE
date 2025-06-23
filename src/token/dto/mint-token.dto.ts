import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class MintTokenDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '0x1234...' })
    to!: string;

    @IsNotEmpty()
    @IsNumberString() // để chấp nhận dạng chuỗi số: "1000"
    @ApiProperty({ example: '100' })
    amount!: string;
}
