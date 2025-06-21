import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { verifyMessage, Wallet } from 'ethers';

@Injectable()
export class AuthService {
  // ✅ Map này chỉ là giả lập - nên dùng Redis thực tế
  private readonly nonces = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly ipfsService: IpfsService,
  ) {}

  /**
   * Tạo hoặc trả về nonce để user ký
   */
  getNonce(wallet: string) {
    const normalized = wallet.toLowerCase();

    // ✅ Nếu nonce đã tồn tại (chưa verify) thì dùng lại
    const existing = this.nonces.get(normalized);
    if (existing) return { message: existing };

    const nonce = `Sign this message to login:\nWallet: ${normalized}\nNonce: ${Date.now()}`;
    this.nonces.set(normalized, nonce);

    return { message: nonce };
  }

  /**
   * Chỉ dùng nếu bạn cần ký message phía server
   */
  async generateSignature(walletAddress: string, nonce: string, privateKey: string): Promise<string> {
    if (!privateKey) {
      throw new Error('Missing AUTH_SIGNER_PRIVATE_KEY');
    }

    const message = `Welcome to Web3 App!\n\nWallet: ${walletAddress}\nNonce: ${nonce}`;
    const wallet = new Wallet(privateKey);

    return wallet.signMessage(message);
  }

  /**
   * Xác minh chữ ký và tạo JWT nếu hợp lệ
   */
  async verifySignature(wallet: string, signature: string) {
    const normalized = wallet.toLowerCase();
    const nonceMessage = this.nonces.get(normalized);

    if (!nonceMessage) {
      throw new UnauthorizedException('❌ Nonce không tồn tại cho ví này.');
    }

    let recovered: string;
    try {
      recovered = verifyMessage(nonceMessage, signature).toLowerCase();
    } catch {
      throw new UnauthorizedException('❌ Chữ ký không hợp lệ.');
    }

    if (recovered !== normalized) {
      throw new UnauthorizedException('❌ Địa chỉ ví không khớp với chữ ký.');
    }

    // ✅ Tạo user nếu chưa tồn tại
    await this.usersService.createIfNotExists(normalized);

    // ✅ Tạo JWT
    const payload = { wallet: normalized };
    const accessToken = this.jwtService.sign(payload);

    // ✅ Xoá nonce sau khi xác thực
    this.nonces.delete(normalized);

    return {
      accessToken,
      wallet: normalized,
    };
  }
}
