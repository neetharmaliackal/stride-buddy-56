export interface RegisterPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
