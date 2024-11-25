import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly _refreshTokenOptions: CookieOptions;
  private readonly _refreshTokenHeaderOptions: (token: string) => object;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const env = this.configService.get('NODE_ENV');
    const isDev = env === 'development';
    this._refreshTokenOptions = {
      // 개발시 false
      httpOnly: isDev ? false : true,
      secure: isDev ? false : true,
      //
      sameSite: 'strict',
      maxAge: parseInt(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      ),
    };
    this._refreshTokenHeaderOptions = (accessToken: string) => ({
      authorization: accessToken,
      'Access-Control-Expose-Headers': 'authorization',
    });
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth Callback',
    description: '구글 인가 코드를 받아, 구글 회원정보를 받아 핸들링',
  })
  @ApiResponse({
    status: 200,
    description: '회원 상태에 따라 응답이 달라집니다.',
    content: {
      'application/json': {
        examples: {
          registeredUser: {
            summary: '이미 가입된 회원',
            value: {
              isRegistered: true,
              user: {
                email: 'ghdqlsdl9633@gmail.com',
                nickName: 'redbean',
                firstName: 'hongbeen',
                lastName: 'lee',
                picture: null,
              },
            },
          },
          unregisteredUser: {
            summary: '미가입 회원',
            value: {
              isRegistered: false,
              user: {
                email: 'ghdqlsdl9633@gmail.com',
                firstName: 'hongbeen',
                lastName: 'lee',
                picture: null,
              },
              message: 'Additional registration required.',
            },
          },
        },
      },
    },
  })
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: CreateUserDto }> {
    const user = req.user as CreateUserDto;

    const { accessToken, refreshToken } = await this.authService.login(user);

    res
      .cookie('refreshToken', refreshToken, this._refreshTokenOptions)
      .set(this._refreshTokenHeaderOptions(accessToken));

    return { user };
  }

  @Post('signUp')
  @ApiOperation({
    summary: 'User Signup',
    description:
      '사용자로부터 추가 정보를 받아 회원가입을 완료합니다. 이미 회원가입된 이메일은 오류로 처리됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입이 성공적으로 완료되었습니다.',
    content: {
      'application/json': {
        examples: {
          success: {
            summary: '회원가입 성공',
            value: {
              user: {
                email: 'ghdqlsdl9633@gmail.com',
                userName: 'redbean',
                firstName: 'hongbeen',
                lastName: 'lee',
                picture: 'https://example.com/profile.jpg',
              },
              message: 'User registered successfully.',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '이미 가입된 회원 이메일.',
    content: {
      'application/json': {
        examples: {
          conflict: {
            summary: '중복 이메일',
            value: {
              status: 'failure',
              message: 'Email already registered. Please log in.',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: '닉네임 유효성 검증 실패.',
    content: {
      'application/json': {
        examples: {
          validationError: {
            summary: '유효하지 않은 닉네임',
            value: {
              status: 'failure',
              message: 'Nickname contains invalid characters.',
            },
          },
        },
      },
    },
  })
  async signUp(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(createUserDto);

    res
      .cookie('refreshToken', refreshToken, this._refreshTokenOptions)
      .set(this._refreshTokenHeaderOptions(accessToken));

    return { user: createUserDto };
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
