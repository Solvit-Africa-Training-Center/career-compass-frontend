import { createContext, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { User } from "@/types";

interface FormErrors {
  email?: string;
  password?: string;
}

const AuthContext = createContext<{
  authUser: User | null;
  logout: () => void;
  register: (user: User, confirm: string) => Promise<void>;
  loading: boolean;
  errors: FormErrors;
  isDeleting: boolean;
} | null>(null);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children })=>{
    const id = useParams()
    const [refresh, setRefresh] = useState(false);
    const [authUser, setAuthUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate()
    const [formData, setFormData] = useState<User>({
    // userId: "",
    email: "",
    password: "",
  });
    
const register = async (user:User, confirm) => {
    setLoading(true);
        setErrors('');

}

const logout = () => {
        setAuthUser(null);
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auths');
        sessionStorage.removeItem('roles');
    };


    return (
        <AuthContext.Provider value={{ authUser, logout, register, loading, errors,  isDeleting,}}>
            {children}
        </AuthContext.Provider>
    )
}
// export const useAuth = () => React.useContext(AuthContext);