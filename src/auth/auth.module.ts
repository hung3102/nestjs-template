import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [
    AuthResolver,
    AuthService,
    UserService,
    EmailService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
