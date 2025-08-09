export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserRegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthenticatedUser = User;
export type AuthUser = AuthenticatedUser | null;

export type AuthContextValue = {
  user: AuthUser; // the authenticated user
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthenticatedUser) => void;
  logout: () => void;
};

export type UserLoginInput = {
  email: string;
  password: string;
};
