import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IDbRepository } from '../repository/DbRepository';
import { ITokenRepository } from '../interfaces/TokenRepository';
import { LoginDto } from '@src/application/interface/dto/request/auth/LoginDto';
import { LoginResponseDto } from '@src/application/interface/dto/response/auth/LoginResponseDto';
import { RegisterDto } from '@src/application/interface/dto/request/auth/RegisterDto';
import { RegisterResponseDto } from '@src/application/interface/dto/response/auth/RegisterResponseDto';
import { AuthBuilder } from '../entities/transformer/AuthBuilder';
import * as bcrypt from 'bcrypt';
import { DEFAULT_ROL_USER } from '../constants/AppConstants';
import { IEmailRepository } from '../repository/EmailRepository';

@Injectable()
export class AuthManagerDomainService {
  private readonly logger = new Logger(AuthManagerDomainService.name);

  constructor(
    @Inject('DbRepository')  private readonly dbRepository: IDbRepository,
    @Inject('TokenRepository') private readonly tokenRepository: ITokenRepository,
    @Inject('EmailRepository') private readonly emailRepository: IEmailRepository,
  ) {}

  async login(payload: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.dbRepository.findUserByEmail(payload.email);
      if (!user) throw new UnauthorizedException('Credenciales incorrectas');

      const isPasswordValid = await bcrypt.compare(payload.password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Credenciales incorrectas');

      if (!user.is_active) throw new UnauthorizedException('Usuario inactivo');

      const tokenPayload = {
        metaData: {
          user_data: {
            id:    user._id.toString(),
            email: user.email,
            role:  user.role_id?.rol,
          },
          modules: AuthBuilder.extractModules(user),
        },
      };
      const { token, expiresIn } = await this.tokenRepository.generateToken(tokenPayload);

      const builder = new AuthBuilder(user, token, expiresIn);
      return builder.buildLoginResponse();
    } catch (error) {
      this.logger.error(`Error login: ${error}`);
      throw error;
    }
  }

  async register(payload: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const existingUser = await this.dbRepository.findUserByEmail(payload.email);
      if (existingUser) throw new ConflictException('El email ya está registrado');

      const defaultRole = await this.dbRepository.findRoleByName(DEFAULT_ROL_USER);
      if (!defaultRole) throw new NotFoundException(`Rol "${DEFAULT_ROL_USER}" no encontrado`);

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      await this.dbRepository.createUser({
        ...payload,
        password: hashedPassword,
        role_id: defaultRole._id, 
      } as any);

      const userWithRole = await this.dbRepository.findUserByEmail(payload.email);

      this.emailRepository
        .sendWelcomeEmail(userWithRole.email, userWithRole.username)
        .catch(err => this.logger.error(`Error sending welcome email: ${err}`));

      const builder = new AuthBuilder(userWithRole, null, null);
      return builder.buildRegisterResponse();
    } catch (error) {
      this.logger.error(`Error register: ${error}`);
      throw error;
    }
  }

}