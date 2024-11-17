import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthToken } from 'src/database/models/authToken.model';
import { AuthDto } from './dto/auth.dto';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, JWTUser } from './currentUser';
import { LoginGuard } from './guards/login.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { SignupParam } from 'src/user/dto/create-user.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AuthToken)
  async signup(
    @Args('data', { type: () => SignupParam }) createUserDto: SignupParam,
  ): Promise<AuthToken> {
    return await this.authService.signUp(createUserDto);
  }

  @Query(() => Boolean)
  @UseGuards(LoginGuard)
  async resendConfirmEmail(@CurrentUser() user: JWTUser): Promise<boolean> {
    return await this.authService.resendConfirmEmail(user);
  }

  @Query(() => AuthToken)
  async signin(
    @Args('data', { type: () => AuthDto }) authDto: AuthDto,
  ): Promise<AuthToken> {
    return await this.authService.signIn(authDto);
  }

  @Query(() => Boolean, { nullable: true })
  @UseGuards(LoginGuard)
  async logout(@CurrentUser() user: JWTUser): Promise<void> {
    return await this.authService.logout(user.id);
  }

  @Query(() => AuthToken)
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@CurrentUser() user: JWTUser): Promise<AuthToken> {
    return this.authService.refreshTokens(user.id, user.postedRefreshToken);
  }
}
