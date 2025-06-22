import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BuyItemDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '0x1234..', description: 'Địa chỉ ví của người mua' })
    buyer!: string;
}
