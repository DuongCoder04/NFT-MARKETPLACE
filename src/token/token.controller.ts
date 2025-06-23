// src/blockchain/token.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransferTokenDto } from 'src/token/dto/transfer-token.dto';
import { MintTokenDto } from './dto/mint-token.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Token')
@Controller('token')
@ApiBearerAuth()
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Post('transfer')
    @UseGuards(AuthGuard('jwt'))
    async transfer(@Body() dto: TransferTokenDto) {
        return this.tokenService.transferToken(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('mint')
    async mintToken(@Body() body: MintTokenDto) {
        return this.tokenService.mint(body);
    }

    @UseGuards(AuthGuard('jwt'))
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
