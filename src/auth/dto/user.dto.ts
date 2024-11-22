import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  profile: string;

  @IsString()
  googleAccessToken: string;

  @IsString()
  googleRefreshToken: string;
}