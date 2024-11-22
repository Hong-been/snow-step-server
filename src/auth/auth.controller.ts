import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GoogleJwtDto } from './dto/googleJwt.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth Callback',
    description:
      '구글 JWT를 받고, 서비스 JWT를 반환한다. 구글 토큰은 디비에 저장한다.',
  })
  @ApiResponse({
    status: 200,
    description:
      'JWT Access Token issued and Refresh Token set as HttpOnly cookie.',
    example: {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    },
  })
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) googleJwt: GoogleJwtDto,
  ): Promise<{ accessToken: string }> {
    const user = req.user;
    const { accessToken, refreshToken } = await this.authService.googleLogin(
      user,
      googleJwt,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, //개발시 false
      sameSite: 'strict',
      maxAge: parseInt(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      ),
    });

    return { accessToken };
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
