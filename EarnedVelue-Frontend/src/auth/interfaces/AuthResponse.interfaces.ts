export interface AuthLoginResponse {
  ok: boolean;
  user: User;
  token: string;
}

export interface User {
  id_user: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}
