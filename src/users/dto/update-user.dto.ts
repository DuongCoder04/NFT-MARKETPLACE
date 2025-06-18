import { IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {    
      @IsOptional()
      @IsObject()
      @ApiProperty({example: {
        "username": "duong.eth",
        "bio": "Fullstack Web3 Developer",
        "avatar": "https://cdn.example.com/duong-avatar.png"
      }})
      profile_data?: Record<string, any>;
}
