// src/blockchain/token.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransferTokenDto } from 'src/blockchain/dto/transfer-token.dto';
import { MintTokenDto } from './dto/mint-token.dto';

@ApiTags('Token')
@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Post('transfer')
    async transfer(@Body() dto: TransferTokenDto) {
        return this.tokenService.transferToken(dto);
    }

    @Post('mint')
    @ApiOperation({ summary: 'Mint thêm token ERC-20 cho 1 địa chỉ' })
    async mintToken(@Body() body: MintTokenDto) {
        return this.tokenService.mint(body);
    }

    @Get('balance/:address')
    async getBalance(@Param('address') address: string) {
        const balance = await this.tokenService.balanceOf(address);
        return {
            address,
            balance,
            symbol: 'MTK',
        };
    }
}
