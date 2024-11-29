import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { NewsletterCategory } from '../entities/newsletter.entity';

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
    example: 'https://kofearticle.substack.com/profile/image',
  })
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example:
      '매주 한국어로 다양한 아티클을 번역 혹은 작성된 프론트엔드 글을 제공하는 서비스',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://kofearticle.substack.com',
  })
  @IsString()
  serviceUrl?: string;

  @ApiProperty({
    example: 'https://kofearticle.substack.com/subscribe',
  })
  @IsString()
  subscriptionUrl?: string;

  @ApiProperty({
    example: 'https://kofearticle.substack.com/archive',
  })
  @IsString()
  archiveUrl?: string;

  @ApiProperty({
    example: false,
  })
  isValidated?: boolean;

  @ApiProperty({
    enum: NewsletterCategory,
  })
  @IsEnum(NewsletterCategory)
  category?: NewsletterCategory;
}
