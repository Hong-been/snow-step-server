import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  googleId: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  picture: string;
}
