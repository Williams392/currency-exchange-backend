import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "../../domain/conf/EnvVariables";
import { LoggerModule } from "src/logger/logger.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthManagerModule } from "../controllers/AuthManagerModule";
import { UserManagerModule } from "../controllers/UserManagerModule";
import { ExchangeManagerModule } from "../controllers/ExchangeManagerModule";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('app.db.uri'),
      })
    }),
    LoggerModule,
    AuthManagerModule,
    UserManagerModule,
    ExchangeManagerModule
  ]
})
export class AppModule {}