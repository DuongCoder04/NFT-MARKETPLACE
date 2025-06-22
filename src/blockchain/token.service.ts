import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import MyTokenAbi from '../../abi/MyToken.abi.json';
import { TransferTokenDto } from './dto/transfer-token.dto';
import { MintTokenDto } from './dto/mint-token.dto';
import { TransactionsService } from 'src/transaction/transaction.service';
// kiểm tra path đúng chưa

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(
    private readonly configService: ConfigService,
    private readonly txService: TransactionsService,
  ) {
    const rpcUrl = this.configService.get<string>('BSC_TESTNET_RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const contractAddress = this.configService.get<string>('TOKEN_CONTRACT_ADDRESS');

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new InternalServerErrorException('Missing configuration for blockchain connection');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, MyTokenAbi, this.wallet);
  }

  async transferToken(dto: TransferTokenDto) {
    try {
      const amountInWei = ethers.parseUnits(dto.amount, 18);
      const tx = await this.contract.transfer(dto.to, amountInWei);
      await tx.wait();

      await this.txService.logTransaction({
        hash: tx.hash,
        from: this.wallet.address,
        to: dto.to,
        amount: dto.amount,
        type: 'transfer',
      });

      return {
        hash: tx.hash,
        to: dto.to,
        amount: dto.amount,
        status: 'success',
        explorer: `https://testnet.bscscan.com/tx/${tx.hash}`,
      };
    } catch (error) {
      this.logger.error('Transfer token failed', error);

      // log thất bại nếu cần
      await this.txService.logTransaction({
        hash: 'N/A',
        from: this.wallet.address,
        to: dto.to,
        amount: dto.amount,
        type: 'transfer',
        status: 'failed',
      });

      throw new InternalServerErrorException('Transfer token failed');
    }
  }

  async mint(dto: MintTokenDto): Promise<any> {
    try {
      const tx = await this.contract.mint(dto.to, ethers.parseUnits(dto.amount, 18));
      await tx.wait();

      await this.txService.logTransaction({
        hash: tx.hash,
        from: this.wallet.address,
        to: dto.to,
        amount: dto.amount,
        type: 'mint',
      });

      return {
        hash: tx.hash,
        to: dto.to,
        amount: dto.amount,
        status: 'success',
        explorer: `https://testnet.bscscan.com/tx/${tx.hash}`,
      };
    } catch (error) {
      this.logger.error('Mint token failed', error);

      await this.txService.logTransaction({
        hash: 'N/A',
        from: this.wallet.address,
        to: dto.to,
        amount: dto.amount,
        type: 'mint',
        status: 'failed',
      });

      throw new InternalServerErrorException('Mint token failed');
    }
  }

  async balanceOf(address: string): Promise<string> {
    try {
      const rawBalance = await this.contract.balanceOf(address);
      const decimals = await this.contract.decimals();
      return ethers.formatUnits(rawBalance, decimals);
    } catch (error) {
      this.logger.error('Get balance failed', error);
      throw new InternalServerErrorException('Get balance failed');
    }
  }
}
