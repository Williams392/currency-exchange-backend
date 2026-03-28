export interface UserResponse {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_active: boolean;
  last_connection: string | null;
  modules: ModuleInfo[];
}

export interface ModuleInfo {
  name: string;
  key_name: string;
  permissions: string[];
}

export interface UserProfile {
  userData: UserResponse;
  modules: ModuleInfo[];
}