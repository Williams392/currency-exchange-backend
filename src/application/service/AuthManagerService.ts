import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthManagerDomainService } from "@src/domain/service/AuthManagerDomainService";
import { RegisterResponseDto } from "../interface/dto/response/auth/RegisterResponseDto";
import { RegisterDto } from "../interface/dto/request/auth/RegisterDto";
import { LoginDto } from "../interface/dto/request/auth/LoginDto";
import { LoginResponseDto } from "../interface/dto/response/auth/LoginResponseDto";

export class AuthManagerService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly authManagerDomainService: AuthManagerDomainService,
    private readonly configService: ConfigService
  ) { }

  async login(payload: LoginDto): Promise<LoginResponseDto> {
    try {
      return await this.authManagerDomainService.login(payload);
    } catch (error) {
      this.logger.error(`Error login: ${error}`);
      throw error;
    }
  }

  async register(payload: RegisterDto): Promise<RegisterResponseDto> {
    try {
      return await this.authManagerDomainService.register(payload);
    } catch (error) {
      this.logger.error(`Error register: ${error}`);
      throw error;
    }
  }
}
