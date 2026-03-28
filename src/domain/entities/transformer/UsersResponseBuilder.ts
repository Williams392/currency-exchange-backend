import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Logger } from '@nestjs/common';
import { ModuleInfo, UserResponse } from '../UserResponse';

export class UsersResponseBuilder {
  private readonly logger = new Logger(UsersResponseBuilder.name);
  private readonly users: any[];

  constructor(users: any[]) {
    this.users = users;
  }

  private transformUsers(): UserResponse[] {
    return this.users.map((user: any) => {
      const formattedLastConnection = user.last_connection
        ? format(new Date(user.last_connection), 'dd/MMM/yyyy hh:mm a', { locale: enUS }).toLowerCase()
        : null;

      const modulesMap = new Map<string, ModuleInfo>();
      user.role_id?.roleModulePermissions
        ?.filter((rmp: any) => rmp?.module_id)
        .forEach((rmp: any) => {
          const key = rmp.module_id.key_name;
          if (!modulesMap.has(key)) {
            modulesMap.set(key, {
              name:        rmp.module_id.name,
              key_name:    rmp.module_id.key_name,
              permissions: [],
            });
          }
          if (rmp.permission_id?.key_name) {
            modulesMap.get(key)!.permissions.push(rmp.permission_id.key_name);
          }
        });

      return {
        id:              user._id,
        username:        `${user.first_name} ${user.last_name}`,
        email:           user.email,
        first_name:      user.first_name,
        last_name:       user.last_name,
        role:            user.role_id?.rol,
        is_active:       user.is_active,
        last_connection: formattedLastConnection,
        modules:         Array.from(modulesMap.values()),
      };
    });
  }

  public pipelineBuildUsers(): UserResponse[] {
    return this.transformUsers();
  }
}