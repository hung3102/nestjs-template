import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JWTUser } from '../currentUser';
import { Request } from 'express';

type JwtRefreshTokenPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtRefreshTokenPayload): JWTUser {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    console.log({ payload });
    return {
      id: Number(payload.sub),
      email: payload.email,
      postedRefreshToken: refreshToken,
    };
  }
}
