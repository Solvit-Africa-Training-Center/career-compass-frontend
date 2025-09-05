import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types";
import CallApi from "@/utils/callApi";
import { backend_path } from "@/utils/enum";

interface AuthContextType {
  authUser: User | null;
  register: (formData: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  login: (formData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  errors: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const navigate = useNavigate();

  // Register
  const register = async (formData: { email: string; password: string; confirmPassword: string }) => {
    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setErrors(null);
      const res = await CallApi.post(backend_path.REGISTER, {
        email: formData.email,
        password: formData.password,
      });
      if (res.status === 201) {
        navigate("/email-verification");
      }
    } catch (err: any) {
      setErrors(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (formData: { email: string; password: string }) => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await CallApi.post(backend_path.LOGIN, formData);
      const user: User = { email: formData.email, token: res.data.token, role: res.data.role };
      setAuthUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err: any) {
      setErrors(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setAuthUser(null);
    sessionStorage.clear();
    navigate("/login");
  };
useEffect((): void => {
  const token: string | null = sessionStorage.getItem("token");
  if (token) {
    const decodeToken: { role: string[] } = jwtDecode(token);
    const role: string[] = decodeToken.role;
    if (role.includes("admin") || role.includes("student") || role.includes("agent") || role.includes("school")) {
      setAuthUser({ email: sessionStorage.getItem("email") || "", token, role: role[0] });
    }
  }
}, []);
  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem("user");
    if (saved) setAuthUser(JSON.parse(saved));
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, register, login, logout, loading, errors }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


