import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'ghdqlsdl9633@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'redbean',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    example: '홍빈',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: '이',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocKWA9iz_XVrmh8C_qSy5oGThAWs436greTmQSwwRCtmzBzSGw=s96-c',
  })
  @IsString()
  picture: string;
}
