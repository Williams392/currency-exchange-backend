import { Controller, Post, Body, Get, ValidationPipe } from "@nestjs/common";
import { AuthManagerService } from "@src/application/service/AuthManagerService";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { Public } from "../auth/decorators/Public";
import { LoginDto } from "@src/application/interface/dto/request/auth/LoginDto";
import { RegisterDto } from "@src/application/interface/dto/request/auth/RegisterDto";
import { RegisterResponseDto } from "@src/application/interface/dto/response/auth/RegisterResponseDto";
import { LoginResponseDto } from "@src/application/interface/dto/response/auth/LoginResponseDto";


@Controller("auth")
export class AuthManagerController {
  constructor(
    private readonly validatorService: ValidatorService,
    private readonly authManagerService: AuthManagerService,
  ) { }

  @Public()
  @Post('/login')
  async login(
    @Body(new ValidationPipe({ transform: true })) payload: LoginDto
  ): Promise<LoginResponseDto> {
    try {
      return await this.authManagerService.login(payload);
    } catch (error) {
      console.log('Error login', error);
      throw error;
    }
  }

  @Public()
  @Post('/register')
  async register(
    @Body(new ValidationPipe({ transform: true })) payload: RegisterDto
  ): Promise<RegisterResponseDto> {
    try {
      return await this.authManagerService.register(payload);
    } catch (error) {
      console.log('Error register', error);
      throw error;
    }
  }

}