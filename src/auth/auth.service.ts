import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenExpireTime,
  EmailConfirmTokenExpireDay,
  RefreshTokenExpireTime,
} from 'src/const';
import { AuthDto } from './dto/auth.dto';
import { AuthToken } from 'src/database/models/authToken.model';
import { UserService } from 'src/user/user.service';
import { v4 } from 'uuid';
import { SignupParam } from 'src/user/dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { User, UserStatus } from 'src/database/models/user.model';
import { Transaction } from 'objection';
import { UserAuth } from 'src/database/models/userAuth.model';
import { UserAuthService } from 'src/userAuth/userAuth.service';
import { addDays } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(param: SignupParam): Promise<AuthToken> {
    // Check if user exists
    const userExists = await this.userService.findByEmail(param.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(param.password);

    // Create emailConfirmToken
    const emailConfirmToken = btoa(v4());

    let user: User, userAuth: UserAuth, tokens: AuthToken;
    const trx = await User.startTransaction();

    try {
      user = await this.userService.create(trx, {
        email: param.email,
        password: hash,
        status: UserStatus.INACTIVE,
      });

      userAuth = await this.userAuthService.create(trx, {
        confirmToken: emailConfirmToken,
        confirmTokenCreatedAt: new Date(),
        userId: user.id,
      });

      tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(trx, user.id, tokens.refreshToken);
      await trx.commit();
    } catch (err) {
      await trx.rollback();
      throw err;
    }

    await this.emailService.sendConfirmEmail(user.email, userAuth.confirmToken);

    return tokens;
  }

  async signIn(data: AuthDto): Promise<AuthToken> {
    // Check if user exists
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(null, user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userService.findById(null, userId);
    await user.$query().update({ refreshToken: null });
  }

  async confirmEmail(token: string): Promise<boolean> {
    console.log({ token });
    const now = new Date();

    const userAuth = await this.userAuthService.findByConfirmToken(token);
    if (!userAuth) {
      console.log('Token is not valid: Not found UserAuth');
      return false;
    }

    const user = await this.userService.findById(null, userAuth.userId);
    if (!user) {
      console.log('Token is not valid: Not found user');
      return false;
    }

    // Return if user is already confirmed
    if (user.status == UserStatus.ACTIVE) {
      return true;
    }

    if (
      addDays(userAuth.confirmTokenCreatedAt, EmailConfirmTokenExpireDay) < now
    ) {
      console.log('Token is not valid: Token is expired');
      return false;
    }

    await user.$query().patch({ status: UserStatus.ACTIVE });
    return true;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findById(null, userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(null, user.id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(
    trx: Transaction,
    userId: number,
    refreshToken: string,
  ) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    const user = await this.userService.findById(trx, userId);
    await user.$query(trx).update({ refreshToken: hashedRefreshToken });
  }

  async getTokens(userId: number, email: string): Promise<AuthToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: AccessTokenExpireTime,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: RefreshTokenExpireTime,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
