import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => {
          let header = request?.headers?.authorization || '';
          header = header.replace(/Bearer\s*/gi, '');
          const cookieToken = request?.cookies?.accessToken;
          return cookieToken || header;
        },
      ]),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'secretkey',
    });
  }

  validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  }
}
