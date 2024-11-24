import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './auth.repository';
import { User } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * access, token 신규 발급
   */
  async _createJwt(
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

  /** user를 받아서 이메일로 회원인지 아닌지 구분. 회원이면 토큰과 회원정보 반환.*/
  async signIn(
    user: CreateUserDto,
  ): Promise<null | { accessToken: string; refreshToken: string; user: User }> {
    const foundUser = await this.userRepository.findUserByEmail(user);

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
