import { createContext, useState, useEffect, type ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { User,Profile, ProfileFormData } from "@/types";
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
  fetchProfile: () => Promise<Profile | null>;
  createProfile: (data: ProfileFormData) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  assignRole: (userId: number, roleIds: number[]) => Promise<void>;
  removeRole: (userId: number, roleIds: number[]) => Promise<void>;
  getRoles: (userId: number) => Promise<RoleObj[]>;
  profile: Profile | null;
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
      console.log('Login request data:', formData);
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
        refreshToken: res.data.tokens.refresh,
      };

      // Set user in state and localStorage
      setAuthUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      // Store tokens in both localStorage and cookies
      localStorage.setItem("accessToken", res.data.tokens.access);
      localStorage.setItem("refreshToken", res.data.tokens.refresh);
      
      // Set cookies with appropriate expiration
      Cookies.set("accessToken", res.data.tokens.access, { expires: 1 }); // 1 day for access token
      Cookies.set("refreshToken", res.data.tokens.refresh, { expires: 7 }); // 7 days for refresh token
      Cookies.set("accessToken", res.data.tokens.access);
      Cookies.set("refreshToken", res.data.tokens.refresh, { expires: 7 }); // Refresh token expires in 7 days
      toast.success("Login successful!");
      // Navigate based on user role
      const isAdmin = user.role?.some(r => r.code?.toLowerCase() === 'admin');
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      console.error('Login error:', err);
      // Log detailed error response
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as any).response;
        console.error('Error details:', {
          status: response?.status,
          statusText: response?.statusText,
          data: response?.data,
          headers: response?.headers
        });
        // Show the specific error message from the backend if available
        if (response?.data?.non_field_errors) {
          toast.error(response.data.non_field_errors[0]);
        } else {
          toast.error(getErrorMessage(err, "login"));
        }
      } else {
        toast.error(getErrorMessage(err, "login"));
      }
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
    if (!authUser || loading) {
      return null;
    }
    try {
      setLoading(true);
      const res = await CallApi.get(`${backend_path.GET_USER_BY_ID}?user=${authUser.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      setProfile(res.data);
      return res.data;
    } catch (err: unknown) {
      // toast.error(getErrorMessage(err, "fetch_profile"));
      return null;
    } finally {
      setLoading(false);
    }
  };
//create profile
  const createProfile = async (data: ProfileFormData) => {
    if (!authUser) {
      return;
    }
    try {
      setLoading(true);
      const res = await CallApi.post(backend_path.ADD_USER_PROFILE, data);
      setProfile(res.data);
      toast.success("Profile created successfully!");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "create_profile"));
    } finally {
      setLoading(false);
    }
  }
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
  // Refresh token
  const refreshToken = async (): Promise<string | null> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        return null;
      }

      const response = await CallApi.post(backend_path.REFRESH_TOKEN, {
        refresh: storedRefreshToken
      });

      const { access: newAccessToken } = response.data;
      
      // Update tokens
      localStorage.setItem('accessToken', newAccessToken);
      Cookies.set('accessToken', newAccessToken, { expires: 1 }); // 1 day expiry for access token
      
      if (authUser) {
        const updatedUser = { ...authUser, accessToken: newAccessToken };
        setAuthUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return newAccessToken;
    } catch (error: unknown) {
      // If refresh fails, log the user out
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Try to call logout endpoint to invalidate the token on the server
        await CallApi.post(backend_path.LOGOUT, { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with local cleanup even if server logout fails
    } finally {
      // Clear state
      setAuthUser(null);
      setProfile(null);
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      
      // Show success message and redirect
      toast.success("Logged out successfully!");
      navigate("/login");
    }
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
        createProfile,
        updateProfile,
        assignRole,
        removeRole,
        getRoles,
        profile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;