import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { DbRepository } from "../repository/DbRepository";
import { HttpRepository } from "../repository/HttpRepository";
import { AuthManagerController } from "./AuthManagerController";
import { TokenRepository } from "../repository/TokenRepository";
import { MongooseModule } from "@nestjs/mongoose";
import { DbEntities } from "./DbEntities";
import { AuthManagerService } from "@src/application/service/AuthManagerService";
import { AuthManagerDomainService } from "@src/domain/service/AuthManagerDomainService";
import { AuthModule } from "../auth/AuthModule";
import { EmailRepository } from "../repository/EmailRepository";


@Module({
  imports: [
    AuthModule,
    HttpModule,
    MongooseModule.forFeature(DbEntities),    
  ],
  controllers: [AuthManagerController],
  providers: [
    JwtService,
    ValidatorService,
    AuthManagerService,
    AuthManagerDomainService,
    {
      provide: 'DbRepository',
      useClass: DbRepository
    },
    {
      provide: 'EmailRepository',
      useClass: EmailRepository,
    },
    {
      provide: 'TokenRepository',
      useClass: TokenRepository 
    },
    {
      provide: 'HttpRepository',
      useClass: HttpRepository
    }
  ]
})
export class AuthManagerModule {}
