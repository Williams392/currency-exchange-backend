import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLE_NAME } from '@src/application/constants/Constants';

@Injectable()
export class UserGuard {
  private readonly logger = new Logger(UserGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isOnlyAdmin = this.reflector.get<boolean>('onlyAdmin', context.getHandler());

    const request = context.switchToHttp().getRequest();
    return this.validateUserRole(
      request.roleModulePermissionInformation,
      isOnlyAdmin,
      request
    );
  }

  private validateUserRole(
    userPermissions: any,
    isOnlyAdmin: boolean,
    request: any
  ): boolean {
    const { role, id: authenticatedUserId } = userPermissions;
    const paramUserId = Number(request?.params?.id);

    this.logger.log(`Validating user access - Role: ${role}, AuthID: ${authenticatedUserId}, ParamID: ${paramUserId}`);

    const isAdmin = role === ADMIN_ROLE_NAME;
    if (isAdmin) {
      this.logger.log('User is ADMIN, granting access');
      return true;
    }

    if (isOnlyAdmin) {
      throw new UnauthorizedException(
        'Solo los usuarios con rol de Administrador pueden realizar esta acción'
      );
    }

    if (authenticatedUserId !== paramUserId) {
      throw new UnauthorizedException(
        'No tiene permisos para acceder a la información de otro usuario'
      );
    }

    return true;
  }
}