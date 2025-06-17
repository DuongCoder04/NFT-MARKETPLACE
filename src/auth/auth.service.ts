// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyMessage } from 'ethers';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service'; // 👉 Import UsersService để tạo user

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService, // 👈 Inject UsersService
  ) {}

  // ⚠️ Đây chỉ là nơi lưu nonce giả lập - bạn nên dùng Redis hoặc DB thật!
  private nonces = new Map<string, string>();

  getNonce(wallet: string) {
    const nonce = `Sign this message to login: ${Date.now()}`;
    this.nonces.set(wallet.toLowerCase(), nonce);
    return { message: nonce };
  }

  async verifySignature(wallet: string, signature: string) {
    const lowerWallet = wallet.toLowerCase();
    const message = this.nonces.get(lowerWallet);

    if (!message) {
      throw new UnauthorizedException('No nonce found for this wallet');
    }

    let recoveredAddress: string;
    try {
      recoveredAddress = verifyMessage(message, signature).toLowerCase();
    } catch (error) {
      throw new UnauthorizedException('Invalid signature');
    }

    if (recoveredAddress !== lowerWallet) {
      throw new UnauthorizedException('Signature does not match wallet address');
    }

    // ✅ Tự động tạo user nếu chưa tồn tại
    await this.usersService.createIfNotExists(lowerWallet);

    // ✅ Tạo JWT sau khi xác thực thành công
    const payload = { wallet: lowerWallet };
    const token = this.jwtService.sign(payload);

    // ✅ Xoá nonce để chống replay attack
    this.nonces.delete(lowerWallet);

    return {
      accessToken: token,
    };
  }
}
