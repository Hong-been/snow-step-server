import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNewsletterDto } from './create-newsletter.dto';
import { NewsletterCategory } from '../entities/newsletter.entity';
import { IsEnum } from 'class-validator';

export class UpdateNewsletterDto extends PartialType(CreateNewsletterDto) {
  @ApiProperty({
    example: '뉴스레터 이름',
    description: '뉴스레터 이름',
  })
  name: string;

  @ApiProperty({
    example: '뉴스레터 설명',
    description: '뉴스레터 설명',
  })
  description: string;

  @ApiProperty({
    example: '뉴스레터 이메일',
    description: '뉴스레터 이메일',
  })
  email: string;

  @ApiProperty({
    example: '뉴스레터 주소',
    description: '뉴스레터 주소',
  })
  serviceUrl: string;

  @ApiProperty({
    example: '뉴스레터 구독 주소',
    description: '뉴스레터 구독 주소',
  })
  subscriptionUrl: string;

  @ApiProperty({
    example: '뉴스레터 아카이브 주소',
    description: '뉴스레터 아카이브 주소',
  })
  archiveUrl: string;

  @ApiProperty({
    example: false,
    description: '뉴스레터 유효성 여부',
  })
  isValidated: boolean;

  @ApiProperty({
    enum: NewsletterCategory,
  })
  @IsEnum(NewsletterCategory)
  category: NewsletterCategory;
}
