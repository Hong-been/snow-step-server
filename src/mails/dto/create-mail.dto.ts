import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateMailDto {
  @ApiProperty({
    example:
      '[Korean FE Article] 자바스크립트와 타입스크립트에서 메모이제이션란 무엇인가요?',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'Korean FE article Team <kofearticle@substack.com>',
  })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({
    example: 'redbean@snowstep.com',
    description:
      '@ 앞에 redbean이 user.username에 해당함. 이 값으로 해당유저를 찾아 저장',
  })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'Email content (HTML or plain text)',
    example: '<p>Thank you for signing up!</p>',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
