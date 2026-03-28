import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class InternalJwtStrategy extends PassportStrategy(Strategy, 'internal-jwt') {
  private readonly logger = new Logger(InternalJwtStrategy.name);
  
  constructor(private configService: ConfigService) {
    const secretCustomJwtKey = configService.getOrThrow<string>('app.jwt.secret');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretCustomJwtKey
    });
  }

  async validate(payload: any) {
    this.logger.log(`Validating JWT payload: ${JSON.stringify(payload)}`);
    
    const { metaData } = payload;
    const { user_data, modules } = metaData;
    const { role, id, email } = user_data;
    
    return {
      id,
      email,
      role: role,
      modules
    };
  }
}