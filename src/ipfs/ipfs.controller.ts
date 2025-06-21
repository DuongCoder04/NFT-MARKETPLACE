import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { IpfsService } from './ipfs.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('ipfs')
@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload-image')
  @ApiOperation({ summary: 'Upload image to IPFS' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const ipfsUrl = await this.ipfsService.uploadImage(file);
    return { ipfsUrl };
  }

  @Post('upload-metadata')
  @ApiOperation({ summary: 'Upload metadata JSON to IPFS' })
  async uploadMetadata(@Body() body: CreateMetadataDto) {
    const ipfsUrl = await this.ipfsService.uploadMetadata(body);
    return { ipfsUrl };
  }
}
