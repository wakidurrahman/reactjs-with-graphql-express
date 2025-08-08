import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type AuthenticatedUser = { id: string; name: string; email: string };
export type AuthUser = AuthenticatedUser | null;

type AuthContextValue = {
  user: AuthUser;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthenticatedUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('ms_token');
    const storedUser = localStorage.getItem('ms_user');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (
    newToken: string,
    newUser: { id: string; name: string; email: string }
  ) => {
    localStorage.setItem('ms_token', newToken);
    localStorage.setItem('ms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('ms_token');
    localStorage.removeItem('ms_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

// Typed helpers for non-null access
export const useAuthUser = (): AuthenticatedUser => {
  const { user } = useAuthContext();
  if (!user) throw new Error('useAuthUser requires an authenticated user');
  return user;
};

export const useAuthToken = (): string => {
  const { token } = useAuthContext();
  if (!token) throw new Error('useAuthToken requires an authenticated token');
  return token;
};
