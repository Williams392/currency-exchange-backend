import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class InternalJwtGuard extends AuthGuard('internal-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, roleModulePermissionInformation: any, info: any, context: ExecutionContext) {
    if (err || !roleModulePermissionInformation) {
      throw err || new UnauthorizedException('Acceso no autorizado');
    }
    
    const request = context.switchToHttp().getRequest();
    request.roleModulePermissionInformation = roleModulePermissionInformation;

    return roleModulePermissionInformation;
  }
}