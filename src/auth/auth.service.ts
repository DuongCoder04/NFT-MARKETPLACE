// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { verifyMessage, Wallet } from 'ethers';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) { }

  /**
   * Tạo hoặc trả về nonce để user ký
   */
  async getNonce(wallet: string) {
    const normalized = wallet.toLowerCase();
    const key = `nonce:${normalized}`;

    let nonceMessage = await this.redisService.get(key);
    if (nonceMessage) return { message: nonceMessage };

    const nonce = `Nonce: ${Date.now()}`;
    await this.redisService.set(key, nonce, 300); // TTL: 5 phút
    //console.log('Generated nonce for wallet:', normalized, '->', nonce);
    return { message: nonce };
  }

  /**
   * Tạo chữ ký (chỉ khi cần ký server-side)
   */
  async generateSignature(walletAddress: string, nonce: string, privateKey: string): Promise<string> {
    const normalized = walletAddress.toLowerCase();
    if (!privateKey) {
      throw new Error('Missing AUTH_SIGNER_PRIVATE_KEY');
    }

    const message = `Nonce: ${nonce}`;
    const wallet = new Wallet(privateKey);
    //console.log('Signing message for wallet:', normalized, '->', message);
    return wallet.signMessage(message);
  }

  /**
   * Xác minh chữ ký và trả về JWT
   */
  async verifySignature(wallet: string, signature: string) {
    const normalized = wallet.toLowerCase();
    const key = `nonce:${normalized}`;

    const nonceMessage = await this.redisService.get(key);
    //console.log('Nonce message for wallet:', normalized, '->', nonceMessage);
    if (!nonceMessage) {
      throw new UnauthorizedException('❌ Nonce không tồn tại cho ví này.');
    }

    let recovered: string;
    try {
      recovered = verifyMessage(nonceMessage, signature).toLowerCase();
    } catch {
      throw new UnauthorizedException('❌ Chữ ký không hợp lệ.');
    }
    //console.log('Recovered address:', recovered);
    if (recovered !== normalized) {
      throw new UnauthorizedException('❌ Địa chỉ ví không khớp với chữ ký.');
    }

    // Tạo user nếu chưa có
    await this.usersService.createIfNotExists(normalized);

    // Tạo JWT
    const payload = { wallet: normalized };
    const accessToken = this.jwtService.sign(payload);

    // Xoá nonce sau khi verify
    await this.redisService.del(key);

    return {
      accessToken,
      wallet: normalized,
    };
  }
}
