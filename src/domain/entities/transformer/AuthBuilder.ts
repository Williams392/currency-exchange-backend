import { Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { LoginResponseDto } from '@src/application/interface/dto/response/auth/LoginResponseDto';
import { RegisterResponseDto } from '@src/application/interface/dto/response/auth/RegisterResponseDto';
import { UserResponseDto, ModuleResponseDto } from '@src/application/interface/dto/response/user/UserResponseDto';

export class AuthBuilder {
  private readonly logger = new Logger(AuthBuilder.name);
  private readonly userData: any;
  private readonly token:     string | null;
  private readonly expiresIn: number | null;

  constructor(userData: any, token: string | null, expiresIn: number | null) {
    this.userData  = userData;
    this.token     = token;
    this.expiresIn = expiresIn;
  }

  buildLoginResponse(): LoginResponseDto {
    return {
      token:     this.token!,
      expiresIn: this.expiresIn!,
      user:      this.buildUserResponse(),
    };
  }

  buildRegisterResponse(): RegisterResponseDto {
    return {
      message: 'Usuario registrado exitosamente',
      user:    this.buildUserResponse(),
    };
  }

  private buildUserResponse(): UserResponseDto {
    const user = this.userData;
    const role = user.role_id;

    const formattedLastConnection = user.last_connection
      ? format(new Date(user.last_connection), 'dd/MMM/yyyy hh:mm a', { locale: enUS }).toLowerCase()
      : null;

    return {
      id:              user._id.toString(),
      username:        user.username,
      email:           user.email,
      first_name:      user.first_name,
      last_name:       user.last_name,
      role:            role?.rol,
      is_active:       user.is_active,
      last_connection: formattedLastConnection,
      modules:         AuthBuilder.extractModules(user),
    };
  }

  static extractModules(user: any): ModuleResponseDto[] {
    const modulesMap = new Map<string, Set<string>>();

    user.role_id?.roleModulePermissions?.forEach((rmp: any) => {
      const moduleKey     = rmp.module_id?.key_name;
      const permissionKey = rmp.permission_id?.key_name;
      if (moduleKey && permissionKey) {
        if (!modulesMap.has(moduleKey)) modulesMap.set(moduleKey, new Set());
        modulesMap.get(moduleKey)!.add(permissionKey);
      }
    });

    return Array.from(modulesMap.entries()).map(([key_name, permsSet]) => {
      const rmp = user.role_id?.roleModulePermissions?.find(
        (r: any) => r.module_id?.key_name === key_name
      );
      return {
        name:        rmp?.module_id?.name ?? key_name,
        key_name,
        permissions: Array.from(permsSet),
      };
    });
  }

}