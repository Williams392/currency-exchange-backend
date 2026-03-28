export const DEFAULT_EXPIRATION_TIME = 60;
export const DEFAULT_LARGE_EXPIRATION_TIME = 1 * 2 * DEFAULT_EXPIRATION_TIME;

export const MAPPER_STRING_TO_BOOLEAN: Record<string, boolean> = {
  "true": true,
  "false": false
}

export enum ModuleKeyName {
  USERS = 'USERS',
  EXCHANGE_RATES = 'EXCHANGE_RATES',
  EXCHANGE_REQUESTS = 'EXCHANGE_REQUESTS'
}

export const BLACKLIST_OF_KEYWORDS = [
  'script', 'javascript', 'onload', 'onerror', 
  'onclick', 'alert', 'document', 'window', 'eval'
];

export const DEFAULT_ROL_USER = 'USER';