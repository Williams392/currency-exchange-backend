import { PaginationFilter } from "@src/domain/entities/Pagination"

export const HTTP_STATUS = {
  BAD_REQUEST: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  SUCCESS: 200
}

export const DEFAULT_PAGINATION_FILTERS_DTO: PaginationFilter = {
  page: 1,
  limit: 50,
  order: "DESC"
}

export const enum PermissionEnum {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export const enum ModuleEnum {
  USERS = 'USERS',
  EXCHANGE_RATES = 'EXCHANGE_RATES',
  EXCHANGE_REQUESTS = 'EXCHANGE_REQUESTS'
}

export const ADMIN_ROLE_NAME = 'ADMIN';
export const PERMISSIONS_KEY = 'permissions';
