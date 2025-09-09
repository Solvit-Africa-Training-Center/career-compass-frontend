import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { User } from "@/types";
import CallApi from "@/utils/callApi";
import { backend_path } from "@/utils/enum";
import { getErrorMessage } from "@/utils/Helper";



interface AuthContextType {
  authUser: User | null;
  registeredEmail: string | null;
  register: (formData: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  login: (formData: { email: string; password: string }) => Promise<void>;
  verifyOTP: (formData: { email: string; otp: string }) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Register
  const register = async (formData: { email: string; password: string; confirmPassword: string }) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const [res] = await Promise.all([
        CallApi.post(backend_path.REGISTER, {
          email: formData.email,
          password: formData.password,
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      if (res.status === 201) {
        setRegisteredEmail(formData.email);
        toast.success("Registration successful! Please check your email for verification.");
        navigate("/email-verification");
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'registration');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (formData: { email: string; password: string }) => {
    try {
      setLoading(true);
      const [res] = await Promise.all([
        CallApi.post(backend_path.LOGIN, formData),
        new Promise(resolve => setTimeout(resolve, 1000)) // Minimum 1s loading
      ]);
      const user: User = { email: formData.email, token: res.data.token, role: res.data.role };
      setAuthUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, 'login');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (formData: { email: string; otp: string }) => {
    try {
      setLoading(true);
      const [response] = await Promise.all([
        CallApi.post(backend_path.VERIFY_EMAIL, formData),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      if (response.status === 200) {
        toast.success("Email verified successfully!");
        navigate("/login");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.status === 400 
        ? "Invalid or expired OTP. Please try again."
        : "Verification failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (email: string) => {
    try {
      setLoading(true);
      await CallApi.post(backend_path.RESEND_OTP, { email });
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
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
    <AuthContext.Provider value={{ authUser, registeredEmail, register, login, verifyOTP, resendOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


