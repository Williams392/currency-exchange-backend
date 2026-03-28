import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalJwtStrategy } from './strategies/InternalJwtStrategy';
import { PermissionGuard } from './guards/PermissionGuard';
import { InternalJwtGuard } from './guards/InternalJwtGuard';
import { UserGuard } from './guards/UserGuard';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('app.jwt.secret'),
        signOptions: { 
          expiresIn: configService.getOrThrow('app.jwt.expiration'),
        },
      }),
    }),
  ],
  providers: [
    InternalJwtStrategy,
    InternalJwtGuard,
    PermissionGuard,
    UserGuard,
  ],
  exports: [
    PassportModule,
    JwtModule,
    InternalJwtGuard, 
    PermissionGuard, 
    UserGuard,
  ],
})
export class AuthModule {}