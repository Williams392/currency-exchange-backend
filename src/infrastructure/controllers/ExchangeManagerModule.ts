import { Logger, Module } from '@nestjs/common';
import { ConfigModule }   from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DbRepository } from '@src/infrastructure/repository/DbRepository';
import { DbEntities }                   from './DbEntities';
import { TokenRepository } from '../repository/TokenRepository';
import { JwtService } from '@nestjs/jwt';
import { HttpRepository } from '../repository/HttpRepository';
import { ExchangeManagerController } from './ExchangeManagerController';
import { ExchangeManagerService } from '@src/application/service/ExchangeManagerService';
import { ExchangeManagerDomainService } from '@src/domain/service/ExchangeManagerDomainService';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature(DbEntities),
  ],
  controllers: [ExchangeManagerController],
  providers: [
    JwtService,
    Logger,
    ExchangeManagerService,
    ExchangeManagerDomainService,
    {
      provide: 'DbRepository',
      useClass: DbRepository
    },
    {
      provide: 'TokenRepository',
      useClass: TokenRepository
    },
    {
      provide: 'HttpRepository',
      useClass: HttpRepository
    }
  ],
})
export class ExchangeManagerModule {}