import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GoogleJwtDto } from './dto/googleJwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
) {} 

  async googleLogin(user: any, jwt: GoogleJwtDto): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.googleId, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: parseInt(this.configService.get<string>("JWT_ACCESS_EXPIRES_IN"))
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: parseInt(this.configService.get<string>("JWT_REFRESH_EXPIRES_IN"))
    });

    await this.storeGoogleJwt(jwt);

    return {accessToken, refreshToken}
  }

  async storeGoogleJwt(jwt: GoogleJwtDto) {
    // 디비에 jwt 2종류 저장
    console.log(`jwt saved!`)
  }
}
