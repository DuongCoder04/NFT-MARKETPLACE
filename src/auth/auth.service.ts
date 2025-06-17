// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyMessage } from 'ethers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  // Giả lập nơi lưu nonce (nên dùng DB thật)
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

    // ✅ Xác thực thành công, tạo JWT
    const payload = { wallet: lowerWallet };
    const token = this.jwtService.sign(payload);

    // Optional: Xoá nonce sau khi dùng để tránh replay attack
    this.nonces.delete(lowerWallet);

    return {
      accessToken: token,
    };
  }
}
