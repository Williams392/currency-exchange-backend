import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLE_NAME } from '@src/application/constants/Constants';

@Injectable()
export class PermissionGuard {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions', 
      context.getHandler()
    );

    const request = context.switchToHttp().getRequest();
    return await this.validatePermissions(request.roleModulePermissionInformation, requiredPermissions, request);
  }

  private formatModulesInformation(modules: any[]): string {
    return modules.map(m => `${m.name}: [${m.permissions.join(', ')}]`).join('; ');
  }

  private validModulePermission(module: string, permission: string, modules: any[]): boolean {
    const availableModule = modules.filter(m => m.name === module && m.permissions.includes(permission));
    
    if(!availableModule.length) {
      throw new UnauthorizedException(
        `No se tiene permisos de ${permission} sobre el módulo ${module}, solo se tiene sobre estos ${this.formatModulesInformation(modules)}`
      );
    }
    
    return true;
  }

  private async validatePermissions(userPermissions: any, requiredPermissions: any, requestContext: any): Promise<boolean> {
    const [permission, module] = requiredPermissions;
    const { role, modules } = userPermissions;
    
    this.logger.log(`Selected Permission ${permission}`);

    if(!module) {
      throw new UnauthorizedException(`Se requiere un módulo válido`);
    }

    if(role === ADMIN_ROLE_NAME) return true;

    return this.validModulePermission(module, permission, modules);
  }
}