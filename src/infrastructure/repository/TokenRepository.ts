import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GeneratedToken, ITokenRepository } from '@src/domain/interfaces/TokenRepository';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateToken<T>(payload: T & { expiresInSeconds?: number }): Promise<GeneratedToken> {
    const { expiresInSeconds, ...data } = payload as any;
    const expirationTime = expiresInSeconds || this.configService.get<number>('app.jwt.expiration');
    
    const token = this.jwtService.sign(
      data,
      {
        secret: this.configService.get<string>('app.jwt.secret'),
        expiresIn: expirationTime
      }
    );

    return {
      token,
      expiresIn: expirationTime
    };
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('app.jwt.secret')
    });
  }
}