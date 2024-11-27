import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/auth.entity';
import { JwtAuthGuard } from './guard/authGuard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly _refreshTokenOptions: CookieOptions;
  private readonly _accessTokenHeaderOptions: (token: string) => object;

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
      sameSite: isDev ? 'none' : 'strict',
      //
    };
    this._accessTokenHeaderOptions = (accessToken: string) => ({
      authorization: `Bearer ${accessToken}`,
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
                id: 1,
                email: 'ghdqlsdl9633@gmail.com',
                userName: 'redbean',
                firstName: 'hongbeen',
                lastName: 'lee',
                picture: null,
                createdAt: '2024-11-26 01:50:08.406679',
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
  ): Promise<{ user: User }> {
    const user = req.user as CreateUserDto;

    const foundUserAndToken = await this.authService.signIn(user);
    if (foundUserAndToken) {
      const { user, accessToken, refreshToken } = foundUserAndToken;

      res
        .cookie('refreshToken', refreshToken, {
          ...this._refreshTokenOptions,
          maxAge: parseInt(
            this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
          ),
        })
        .set(this._accessTokenHeaderOptions(accessToken));

      return { user };
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
        .set(this._accessTokenHeaderOptions(accessToken));

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

  @ApiOperation({
    summary: 'JWT 토큰을 인증하고 토큰에 해당하는 유저 데이터를 반환한다.',
  })
  @ApiResponse({
    status: 200,
    description: '유저 정보를 반환',
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 유요하지않음',
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<User> {
    const foundUser = req.user as User; // 데코레이터 JwtAuthGuard 에 의해 불러와진다.
    if (foundUser) {
      return foundUser;
    }

    throw new UnauthorizedException();
  }

  @ApiOperation({
    summary: 'refresh가 유효하면 access를 새로 발급하고, 아니면 로그아웃',
  })
  @ApiCookieAuth()
  @ApiBearerAuth()
  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies['refreshToken'];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      // Refresh 토큰 검증 및 새로운 액세스 토큰 발급
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(refreshToken);

      // 새로운 Refresh Token 저장
      res
        .cookie('refreshToken', newRefreshToken, this._refreshTokenOptions)
        .set(this._accessTokenHeaderOptions(accessToken));
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('/logout')
  @ApiCookieAuth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logs out the user by clearing the refresh token cookie.',
    description:
      'Clears the refresh token cookie and ends the user session on the client side.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out.',
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    try {
      res.clearCookie('refreshToken', this._refreshTokenOptions);
      return { message: 'Successfully logged out.' };
    } catch (error) {
      console.error('Logout error:', error);
      throw new InternalServerErrorException('Could not log out');
    }
  }

  @ApiOperation({
    summary: 'Find user by id',
  })
  @ApiResponse({
    status: 200,
    description: '유저 정보를 반환',
  })
  @ApiResponse({
    status: 404,
    description: '해당 id 유저가 없음.',
  })
  @ApiBearerAuth()
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Param('id') id: number): Promise<User> {
    const foundUser = this.authService.findUserById(id);
    if (foundUser) {
      return foundUser;
    }

    throw new NotFoundException();
  }
}
