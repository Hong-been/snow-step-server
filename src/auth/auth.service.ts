import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * access, token 신규 발급
   */
  async login(
    user: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.firstName, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      ),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      ),
    });

    return { accessToken, refreshToken };
  }

  /** access, token 신규 발급, DB에 신규 등록 */
  async signUp(
    user: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, refreshToken } = await this.login(user);

    // DB에 회원저장

    return { accessToken, refreshToken };
  }
}
