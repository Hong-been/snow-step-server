import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './auth.repository';
import { User } from './entities/auth.entity';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const user = await this.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 새로운 토큰 발급
    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );
    const accessToken = await this.jwtService.signAsync(
      { email: payload.email },
      {
        expiresIn: accessTokenExpiresIn,
      },
    );
    const newRefreshToken = await this.jwtService.signAsync(
      { email: payload.email },
      {
        expiresIn: refreshTokenExpiresIn,
      },
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * access, token 신규 발급
   */
  async _createJwt(
    user: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      email: user.email,
    };

    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  /** user를 받아서 이메일로 회원인지 아닌지 구분. 회원이면 토큰과 회원정보 반환.*/
  async signIn(
    user: CreateUserDto,
  ): Promise<null | { accessToken: string; refreshToken: string; user: User }> {
    const foundUser = await this.findUserByEmail(user.email);

    if (foundUser) {
      const { accessToken, refreshToken } = await this._createJwt(user);
      return { user: foundUser, accessToken, refreshToken };
    }

    return null;
  }

  /** access, token 신규 발급, DB에 신규 등록 */
  async signUp(
    user: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { accessToken, refreshToken } = await this._createJwt(user);

    const savedUser = await this.userRepository.createUser(user);

    return { accessToken, refreshToken, user: savedUser };
  }
}
