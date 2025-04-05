// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from './auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'vN#7qP3r6@uL!g9W0zB#qL^8JxRv5D@1',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Payload:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
