export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_active: boolean;
  last_connection: string | null;
  modules: ModuleResponseDto[];
}

export interface ModuleResponseDto {
  name: string;
  key_name: string;
  permissions: string[];
}
