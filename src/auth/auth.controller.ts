import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
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
import { User } from './auth.entity';

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
    description:
      '전달받은 구글 인가 코드로 구글 회원정보를 조회하여 회원인지 구분한다.',
  })
  @ApiResponse({
    status: 200,
    description:
      '가입된 회원이면 로그인을 진행하고, 미가입회원이면 not found 에러와 구글 사용자정보 반환',
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
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description:
      'google email로 조회한 가입회원이 없음. 구글 사용자정보를 반환함. POST /signUp에서 바디로 사용',
    example: {
      user: {
        email: 'ghdqlsdl9633@gmail.com',
        firstName: 'hongbeen',
        lastName: 'lee',
        picture: null,
      },
    },
  })
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<
    | { isRegistered: true; user: User }
    | { isRegistered: false; user: CreateUserDto }
  > {
    const user = req.user as CreateUserDto;

    const foundUserAndToken = await this.authService.signIn(user);
    if (foundUserAndToken) {
      const { user, accessToken, refreshToken } = foundUserAndToken;

      res
        .cookie('refreshToken', refreshToken, this._refreshTokenOptions)
        .set(this._refreshTokenHeaderOptions(accessToken));

      return { isRegistered: true, user };
    }

    throw new NotFoundException({
      user,
    });
  }

  @Post('signUp')
  @ApiOperation({
    summary: 'User Signup',
    description:
      '사용자로부터 추가 정보를 받아 회원가입을 완료합니다. 이미 회원가입된 이메일은 오류로 처리됩니다.',
  })
  @ApiResponse({
    status: 201,
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
          },
        },
      },
    },
  })
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const { user, accessToken, refreshToken } =
        await this.authService.signUp(createUserDto);

      res
        .cookie('refreshToken', refreshToken, this._refreshTokenOptions)
        .set(this._refreshTokenHeaderOptions(accessToken));

      return { user };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(error.detail);
      } else {
        console.error(error);
        throw new InternalServerErrorException();
      }
    }
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
