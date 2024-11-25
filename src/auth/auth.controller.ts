import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth Callback',
    description:
      '구글 인가 코드를 받아, 구글 회원정보를 받아 회원가입 or 로그인시킨다.',
  })
  @ApiResponse({
    status: 200,
    description:
      'JWT Access Token issued and Refresh Token set as HttpOnly cookie.',
    example: {
      accessToken: 'accessToken',
    },
  })
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: UserDto }> {
    const user = req.user as UserDto;
    const { accessToken, refreshToken } = await this.authService.login(user);

    const env = this.configService.get('NODE_ENV');
    const isDev = env === 'development';
    res
      .cookie('refreshToken', refreshToken, {
        // 개발시 false
        httpOnly: isDev ? false : true,
        secure: isDev ? false : true,
        //
        sameSite: 'strict',
        maxAge: parseInt(
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        ),
      })
      .set({
        authorization: accessToken,
        'Access-Control-Expose-Headers': 'authorization',
      });

    return { user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google Login',
    description:
      '구글의 OAuth 2.0 로그인 페이지로 사용자를 리디렉션. 리디렉션 URL은 GoogleStrategy의 설정값(clientID, callbackURL)에 의해 결정.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth login page.',
  })
  googleLogin(): void {}
}
