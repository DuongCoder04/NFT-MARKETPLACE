import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestMessageDto } from './dto/request-message.dto';
import { LoginDto } from './dto/login.dto';
import { SignatureRequestDto } from './dto/signature-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-message')
  @ApiOperation({ summary: 'Yêu cầu thông điệp để đăng nhập' })
  @ApiResponse({ status: 200, description: 'Trả về message để ký' })
  @ApiBody({ type: RequestMessageDto })
  async getNonce(@Body() dto: RequestMessageDto) {
    if (!dto.wallet) {
      throw new BadRequestException('Thiếu địa chỉ ví');
    }

    const message = await this.authService.getNonce(dto.wallet);

    return { message };
  }
  @Post('generate-signature')
  async getSignature(@Body() body: SignatureRequestDto) {
    const { wallet, nonce , privateKey} = body;
    const signature = await this.authService.generateSignature(wallet, nonce, privateKey);
    return { signature };
  }
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập bằng chữ ký' })
  @ApiResponse({ status: 200, description: 'Trả về JWT token nếu hợp lệ' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    if (!dto.wallet || !dto.signature) {
      throw new BadRequestException('Thiếu ví hoặc chữ ký');
    }

    const token = await this.authService.verifySignature(dto.wallet, dto.signature);

    return { token };
  }
}
