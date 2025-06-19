import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private readonly PINATA_BASE_URL = 'https://api.pinata.cloud/pinning';

  constructor(private readonly configService: ConfigService) {
    // console.log('PINATA_API_KEY:', this.configService.get('PINATA_API_KEY'));
    // console.log('PINATA_API_SECRET:', this.configService.get('PINATA_API_SECRET'));
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const apiKey = this.configService.get<string>('PINATA_API_KEY');
    const secretKey = this.configService.get<string>('PINATA_API_SECRET');

    if (!apiKey || !secretKey) {
      this.logger.error('❌ Missing Pinata credentials');
      throw new InternalServerErrorException('Pinata credentials are missing');
    }

    try {
      const formData = new FormData();
      const filePath = join(process.cwd(), file.path);
      formData.append('file', createReadStream(filePath));

      const res = await axios.post(`${this.PINATA_BASE_URL}/pinFileToIPFS`, formData, {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      });

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      this.logger.error('❌ Upload image failed', error?.response?.data || error.message);
      throw new InternalServerErrorException('Upload image to IPFS failed');
    }
  }

  async uploadMetadata(metadata: any): Promise<string> {
    const apiKey = this.configService.get<string>('PINATA_API_KEY');
    const secretKey = this.configService.get<string>('PINATA_API_SECRET');

    if (!apiKey || !secretKey) {
      this.logger.error('❌ Missing Pinata credentials');
      throw new InternalServerErrorException('Pinata credentials are missing');
    }

    try {
      const payload = {
        pinataMetadata: {
          name: metadata.name || `NFT-Metadata-${Date.now()}`,
        },
        pinataContent: metadata,
      };

      const res = await axios.post(`${this.PINATA_BASE_URL}/pinJSONToIPFS`, payload, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      });

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      this.logger.error('❌ Upload metadata failed', error?.response?.data || error.message);
      throw new InternalServerErrorException('Upload metadata to IPFS failed');
    }
  }
}
