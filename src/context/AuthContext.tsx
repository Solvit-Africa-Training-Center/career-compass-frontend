import { createContext, useState, useEffect, type ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { User,Profile } from "@/types";
import CallApi from "@/utils/callApi";
import { backend_path } from "@/utils/enum";
import { getErrorMessage } from "@/utils/Helper";

type RoleObj = { id: number; code: string; name: string };

interface AuthContextType {
  authUser: User | null;
  registeredEmail: string | null;
  register: (formData: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  login: (formData: { email: string; password: string }) => Promise<void>;
  verifyOTP: (formData: { email: string; otp: string }) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  assignRole: (userId: number, roleIds: number[]) => Promise<void>;
  removeRole: (userId: number, roleIds: number[]) => Promise<void>;
  getRoles: (userId: number) => Promise<RoleObj[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [studentRole, setStudentRole] = useState<RoleObj | null>(null);
  const navigate = useNavigate();

  // Fetch all roles and set student role on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await CallApi.get(backend_path.ROLE_LIST);
        const student = res.data.find(
          (role: RoleObj) =>
            role.code.toLowerCase() === "student" ||
            role.name.toLowerCase() === "student"
        );
        if (student) {
          setStudentRole(student);
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "fetch_roles"));
      }
    };
    fetchRoles();
  }, []);

  // Register
  const register = async (formData: { email: string; password: string; confirmPassword: string }) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const res = await CallApi.post(backend_path.REGISTER, {
        email: formData.email,
        password: formData.password,
      });
      if (res.status === 201 && res.data.user?.id && studentRole) {
        setRegisteredEmail(formData.email);
        // Assign student role after registration
        await CallApi.post(backend_path.ASSIGN_ROLE, {
          user_id: res.data.user.id,
          role_ids: [studentRole.id],
        });
        const user: User = {
          id: res.data.user.id,
          email: formData.email,
          role: [studentRole],
          accessToken: "",
          refreshToken: "",
        };
        setAuthUser(user);
        sessionStorage.setItem("user", JSON.stringify(user));
        toast.success("Registration successful! Please check your email for verification.");
        navigate("/email-verification");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "registration"));
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (formData: { email: string; password: string }) => {
    try {
      setLoading(true);
      const res = await CallApi.post(backend_path.LOGIN, formData);
      let roles: RoleObj[] = [];
      if (res.data.user?.roles && Array.isArray(res.data.user.roles) && res.data.user.roles.length > 0) {
        roles = res.data.user.roles;
      } else if (studentRole) {
        // Assign student role if not present
        await CallApi.post(backend_path.ASSIGN_ROLE, {
          user_id: res.data.user.id,
          role_ids: [studentRole.id],
        });
        roles = [studentRole];
      }
      const user: User = {
        id: res.data.user.id,
        email: res.data.user.email,
        role: roles,
        accessToken: res.data.tokens.access,
        // refreshToken: res.data.tokens.refresh,
      };
      setAuthUser(user);
      localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("accessToken", res.data.tokens.access);
       Cookies.set("accessToken", res.data.tokens.access);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "login"));
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (formData: { email: string; otp: string }) => {
    try {
      setLoading(true);
      const response = await CallApi.post(backend_path.VERIFY_EMAIL, formData);
      if (response.status === 200) {
        toast.success("Email verified successfully!");
        navigate("/login");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "verify_otp"));
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
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "resend_otp"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile for the signed-in user
  const fetchProfile = async () => {
    if (!authUser) {
      return;
    }
    try {
      setLoading(true);
      const res = await CallApi.get(`${backend_path.GET_USER_PROFILE}${authUser.id}/`,{
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      setProfile(res.data);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "fetch_profile"));
    } finally {
      setLoading(false);
    }
  };

// Update profile
  const updateProfile = async (data: Partial<Profile>) => {
    if (!authUser) {
      return;
    }
    try {
      setLoading(true);
      const res = await CallApi.put(`${backend_path.UPDATE_PROFILE}${authUser.id}/`, data);
      setProfile(res.data);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "update_profile"));
    } finally {
      setLoading(false);
    }
  };

// Fetch profile when user logs in
  useEffect(() => {
    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);
  
  // Logout
  const logout = () => {
    setAuthUser(null);
    localStorage.clear();
    
    Cookies.remove("accessToken");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Get Roles for a user (from backend)
  const getRoles = async (userId: number): Promise<RoleObj[]> => {
    try {
      setLoading(true);
      const res = await CallApi.get(`${backend_path.GET_USER_ID}${userId}/`);
      if (res.data?.roles && Array.isArray(res.data.roles)) {
        return res.data.roles;
      }
      return [];
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "get_roles"));
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Assign Role
  const assignRole = async (userId: number, roleIds: number[]) => {
    try {
      setLoading(true);
      await CallApi.post(backend_path.ASSIGN_ROLE, { user_id: userId, role_ids: roleIds });
      toast.success("Role assigned successfully!");
      // Update roles for current user if needed
      if (authUser && authUser.id === userId) {
        const updatedRoles = await getRoles(userId);
        setAuthUser((prev) => prev ? { ...prev, role: updatedRoles } : null);
        sessionStorage.setItem("user", JSON.stringify({ ...authUser, role: updatedRoles }));
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "assign_role"));
    } finally {
      setLoading(false);
    }
  };

  // Remove Role
  const removeRole = async (userId: number, roleIds: number[]) => {
    try {
      setLoading(true);
      await CallApi.post(backend_path.REMOVE_ROLE, { user_id: userId, role_ids: roleIds });
      toast.success("Role removed successfully!");
      if (authUser && authUser.id === userId) {
        const updatedRoles = await getRoles(userId);
        setAuthUser((prev) => prev ? { ...prev, role: updatedRoles } : null);
        sessionStorage.setItem("user", JSON.stringify({ ...authUser, role: updatedRoles }));
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "remove_role"));
    } finally {
      setLoading(false);
    }
  };

  // Storage Restoration
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user: User = JSON.parse(savedUser);
      setAuthUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        registeredEmail,
        register,
        login,
        verifyOTP,
        resendOTP,
        logout,
        loading,
        fetchProfile,
        updateProfile,
        assignRole,
        removeRole,
        getRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;