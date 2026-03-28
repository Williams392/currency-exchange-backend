import { Logger } from '@nestjs/common';
import { UserModule, UserData, UserProfileRaw } from '../UserRawData';

export class UserBuilder {
  private readonly logger = new Logger(UserBuilder.name);
  private readonly userData: any;

  constructor(userData: any) {
    this.userData = userData;
  }

  buildUserInformation(): UserProfileRaw {
    const user = this.userData;
    const role = user.role_id;

    const modulesMap = new Map<string, Set<string>>();

    role?.roleModulePermissions?.forEach((rmp: any) => {
      const moduleName   = rmp.module_id?.name;
      const moduleKey    = rmp.module_id?.key_name;
      const permissionKey = rmp.permission_id?.key_name;

      if (moduleName && moduleKey && permissionKey) {
        if (!modulesMap.has(moduleKey)) {
          modulesMap.set(moduleKey, new Set());
        }
        modulesMap.get(moduleKey)!.add(permissionKey);
      }
    });

    const modules: UserModule[] = Array.from(modulesMap.entries()).map(([key_name, permsSet]) => {
      const rmp = role?.roleModulePermissions?.find((r: any) => r.module_id?.key_name === key_name);
      return {
        name:        rmp?.module_id?.name ?? key_name,
        key_name,
        permissions: Array.from(permsSet),
      };
    });

    const userData: UserData = {
      id:              user._id.toString(),
      username:        user.username,
      first_name:      user.first_name  ?? null,
      last_name:       user.last_name   ?? null,
      role:            role?.rol        ?? null,
      email:           user.email,
      is_active:       user.is_active,
      last_connection: user.last_connection?.toString() ?? null,
    };

    return { userData, modules };
  }
}