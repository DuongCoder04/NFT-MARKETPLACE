import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class IpfsService {
  private readonly PINATA_API_KEY = process.env.PINATA_API_KEY;
  private readonly PINATA_API_SECRET = process.env.PINATA_API_SECRET;
  private readonly PINATA_BASE_URL = 'https://api.pinata.cloud/pinning';

  private readonly logger = new Logger(IpfsService.name);

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const formData = new FormData();
      const filePath = join(process.cwd(), file.path);
      formData.append('file', createReadStream(filePath));

      const res = await axios.post(`${this.PINATA_BASE_URL}/pinFileToIPFS`, formData, {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: this.PINATA_API_KEY,
          pinata_secret_api_key: this.PINATA_API_SECRET,
        },
      });

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      this.logger.error('Upload image failed', error?.response?.data || error.message);
      throw new InternalServerErrorException('Upload image to IPFS failed');
    }
  }

  async uploadMetadata(metadata: any): Promise<string> {
    try {
      const payload = {
        pinataMetadata: {
          name: metadata.name || `NFT-Metadata-${Date.now()}`, // 👈 Thêm tên hiển thị
        },
        pinataContent: metadata, // 👈 Đây là nội dung JSON của metadata
      };

      const res = await axios.post(`${this.PINATA_BASE_URL}/pinJSONToIPFS`, payload, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: this.PINATA_API_KEY,
          pinata_secret_api_key: this.PINATA_API_SECRET,
        },
      });

      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      this.logger.error('Upload metadata failed', error?.response?.data || error.message);
      throw new InternalServerErrorException('Upload metadata to IPFS failed');
    }
  }
}
