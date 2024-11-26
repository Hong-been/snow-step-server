import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtPayload {
  @ApiProperty({
    example: 'ghdqlsdl9633@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
