import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  email: string;
  name: string;
  role: string;
  tenant: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("gfc_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, _password: string) => {
    const mockUser: User = {
      email,
      name: email.split("@")[0],
      role: "超级管理员",
      tenant: "环球贸易科技有限公司",
    };
    setUser(mockUser);
    sessionStorage.setItem("gfc_user", JSON.stringify(mockUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("gfc_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
