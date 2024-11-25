import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
      scope: ['email', 'profile'], // 구글에서 요청할 데이터
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user: UserDto = {
      googleId: id, //105646760566475465730
      email: emails[0].value, //ghdqlsdl9633@gmail.com
      firstName: name.givenName, //홍빈
      lastName: name.familyName, //이
      picture: photos[0].value, //https://lh3.googleusercontent.com/a/ACg8ocKWA9iz_XVrmh8C_qSy5oGThAWs436greTmQSwwRCtmzBzSGw=s96-c
    };

    //accessToken ya29.a0AeDClZDZHg4DPZngC...
    done(null, user);
    return user;
  }
}
