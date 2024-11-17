import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenExpireTime, RefreshTokenExpireTime } from 'src/const';
import { AuthDto } from './dto/auth.dto';
import { AuthToken } from 'src/database/models/authToken.model';
import { UserService } from 'src/users/user.service';
import { v4 } from 'uuid';
import { SignupParam } from 'src/users/dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { UserStatus } from 'src/database/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(param: SignupParam): Promise<AuthToken> {
    // Check if user exists
    const userExists = await this.usersService.findByEmail(param.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(param.password);

    // Create emailConfirmToken
    const emailConfirmToken = await this.hashData(v4());

    const newUser = await this.usersService.create({
      email: param.email,
      password: hash,
      confirmToken: emailConfirmToken,
      confirmTokenCreatedAt: new Date(),
      status: UserStatus.INACTIVE,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    await this.emailService.sendConfirmEmail(newUser);

    return tokens;
  }

  async signIn(data: AuthDto): Promise<AuthToken> {
    // Check if user exists
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    const user = await this.usersService.findById(userId);
    await user.$query().update({ refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
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
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    const user = await this.usersService.findById(userId);
    await user.$query().update({ refreshToken: hashedRefreshToken });
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
