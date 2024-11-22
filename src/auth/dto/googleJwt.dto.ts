import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleJwtDto {
  @IsString()
  @IsNotEmpty()
  googleAccessToken: string;

  @IsString()
  @IsNotEmpty()
  googleRefreshToken: string;
}