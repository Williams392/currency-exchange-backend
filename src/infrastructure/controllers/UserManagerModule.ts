import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { UserManagerController } from "./UserManagerController";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { DbRepository } from "../repository/DbRepository";
import { HttpRepository } from "../repository/HttpRepository";
import { TokenRepository } from "../repository/TokenRepository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserManagerService } from "@src/application/service/UserManagerService";
import { UserManagerDomainService } from "@src/domain/service/UserManagerDomainService";
import { DbEntities } from "./DbEntities";
import { AuthModule } from "../auth/AuthModule";


@Module({
  imports: [
    AuthModule,
    HttpModule,
    MongooseModule.forFeature(DbEntities),    
  ],
  controllers: [UserManagerController],
  providers: [
    JwtService,
    ValidatorService,
    UserManagerService,
    UserManagerDomainService,
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
  ]
})
export class UserManagerModule {}
