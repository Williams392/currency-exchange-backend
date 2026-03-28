export interface UserData {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  email: string;
  is_active: boolean;
  last_connection: string | null;
}

export interface UserModule {
  name: string;
  key_name: string;
  permissions: string[];
}

export interface UserProfileRaw {
  userData: UserData;
  modules: UserModule[];
}