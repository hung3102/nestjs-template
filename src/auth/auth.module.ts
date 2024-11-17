import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { EmailService } from 'src/email/email.service';
import { UserAuthService } from 'src/userAuth/userAuth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    AuthResolver,
    AuthService,
    UserService,
    UserAuthService,
    EmailService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
