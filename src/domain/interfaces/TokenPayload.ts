export interface UserTokenData {
  id: number;
  email: string;
  role: string;
}

export interface TokenModulePermission {
  name: string;
  permissions: string[];
}

export interface TokenMetadata {
  user_data: UserTokenData;
  modules: TokenModulePermission[];
}

export interface TokenPayload {
  metaData: TokenMetadata;
}