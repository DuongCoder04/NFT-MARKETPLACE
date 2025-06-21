import { ConfigService } from '@nestjs/config';
// src/blockchain/token.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import MyTokenAbi from '../../abi/MyToken.abi.json';
import { ethers } from 'ethers';
import { TransferTokenDto } from 'src/blockchain/dto/transfer-token.dto';
import { MintTokenDto } from './dto/mint-token.dto';


@Injectable()
export class TokenService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  constructor(private readonly ConfigService: ConfigService) {
    const rpcUrl = this.ConfigService.get<string>('SEPOLIA_RPC_URL');
    const privateKey = this.ConfigService.get<string>('PRIVATE_KEY');
    const contractAddress = this.ConfigService.get<string>('CONTRACT_ADDRESS');

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing configuration for blockchain connection');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, MyTokenAbi, this.wallet);
  }
  async transferToken(dto: TransferTokenDto) {
    const amountInWei = ethers.parseUnits(dto.amount, 18);
    const tx = await this.contract.transfer(dto.to, amountInWei);
    await tx.wait();

    return {
      hash: tx.hash,
      to: dto.to,
      amount: dto.amount,
    };
  }

  async mint(dto: MintTokenDto): Promise<string> {
    const tx = await this.contract.mint(dto.to, ethers.parseUnits(dto.amount, 18));
    await tx.wait();
    return tx.hash;
  }
  async balanceOf(address: string): Promise<string> {
    const rawBalance = await this.contract.balanceOf(address);
    const decimals = await this.contract.decimals();

    return ethers.formatUnits(rawBalance, decimals);
  }

}