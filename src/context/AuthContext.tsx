import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "../services/api";

export type AppRole = "admin" | "ngo" | "volunteer" | "citizen" | "donor";

interface User { id: string; name: string; email: string; role: AppRole; location?: string; avatar?: string }
interface AuthCtx {
  user: User | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<string>;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const ROLE_HOME: Record<AppRole, string> = {
  admin: "/admin-dashboard", ngo: "/ngo-dashboard",
  volunteer: "/volunteer-dashboard", citizen: "/citizen-dashboard", donor: "/donor-dashboard",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (data: any) => {
    const { data: resData } = await authAPI.register(data);
    localStorage.setItem("token", resData.token);
    localStorage.setItem("user", JSON.stringify(resData.user));
    setUser(resData.user);
    return resData.message;
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);