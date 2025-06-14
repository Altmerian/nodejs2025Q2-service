import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';

export interface JwtPayload {
  userId: string;
  login: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // The JWT has already been verified by passport
    // This method is called with the decoded payload
    // We return the payload which will be attached to the request as request.user
    return {
      userId: payload.userId,
      login: payload.login,
    };
  }
}
