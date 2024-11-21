import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard("google"))
  @ApiOperation({summary: "Google Login", description: "Redirects to Google OAuth login page"})
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth login page.' }) // 리디렉션 응답
  googleLogin(): void{
    // Passport가 구글의 OAuth 2.0 로그인 페이지로 사용자를 리디렉션.
    // 리디렉션 URL은 GoogleStrategy의 설정값(clientID, callbackURL)에 의해 결정.
  }
}
