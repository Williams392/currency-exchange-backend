import { SetMetadata } from "@nestjs/common";
import { PERMISSIONS_KEY } from "@src/application/constants/Constants";


export const RolePermissions = (permission: string, module?: string) => {
  return SetMetadata(PERMISSIONS_KEY, [permission, module]);
};