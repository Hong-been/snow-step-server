import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStepDto {
  @ApiProperty({
    example:
      '- 자바스크립트 함수는 일급 객체로 취급되며, 여러 독특한 특징을 가지고 있습니다. 일급 객체로서의 특징은 자바스크립트 함수가 변수에 할당되거나, 다른 함수의 인자로 전달되거나, 함수에서 반환될 수 있다는 점입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
