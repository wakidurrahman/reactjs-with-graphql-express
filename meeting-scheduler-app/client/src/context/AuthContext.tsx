import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthUser = { id: string; name: string; email: string } | null;

type AuthContextValue = {
  user: AuthUser;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    token: string,
    user: { id: string; name: string; email: string }
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
