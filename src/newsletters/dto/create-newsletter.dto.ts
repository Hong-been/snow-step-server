import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsletterDto {
  @ApiProperty({
    example: 'Korean FE Article',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'kofearticle@substack.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example:
      '매주 한국어로 다양한 아티클을 번역 혹은 작성된 프론트엔드 글을 제공하는 서비스',
  })
  @IsString()
  description?: string;

  @IsString()
  serviceUrl?: string;

  @IsString()
  subscriptionUrl?: string;

  @IsString()
  archiveUrl?: string;
}
