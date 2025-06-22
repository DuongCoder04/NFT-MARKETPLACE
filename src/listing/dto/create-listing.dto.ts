import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsEthereumAddress } from 'class-validator';

export class CreateListingDto {
    @IsNotEmpty({ message: 'itemId không được để trống' })
    @IsNumber({}, { message: 'itemId phải là kiểu số (number)' })
    @IsPositive({ message: 'itemId phải lớn hơn 0' })
    @ApiProperty({ example: 1, description: 'ID của item được niêm yết' })
    itemId!: number;

    @IsNotEmpty({ message: 'price không được để trống' })
    @IsString({ message: 'price phải là kiểu chuỗi (vì sử dụng BigNumber)' })
    @ApiProperty({ example: '100', description: 'Giá của item' })
    price!: string; // thường dùng string vì tiền trên blockchain rất lớn, dùng ethers.parseUnits
}
