import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { User } from "@/types";
import  LogoHeader from "@/components/LogoHeader";
import { useAuth } from "@/hooks/useAuth";
const Login = () => {
const {login,loading}=useAuth()
  const [formData, setFormData] = useState({
    email:"",
    password:"",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
const handleChange=(
  e: React.ChangeEvent<HTMLInputElement>,
  field: keyof User
) => {
  const { value } = e.target;
  setFormData((prev) => ({ ...prev, [field]: value }));
};
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData)
    console.log("Login form submitted");
  };
  return (
    <div className="min-h-screen">
    <LogoHeader />
    <div className=" flex items-center justify-center px-4 py-8">
      
      <div className="max-w-lg w-full rounded-2xl shadow-xl border px-8 md:px-12 py-12 bg-white">
        <h1 className="text-center text-3xl md:text-4xl text-primarycolor-500 font-bold mb-8">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              className="h-12 text-base"
              required
            />
          </div>

          {/* Password field with toggle */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange(e, "password")}
              className="h-12 text-base pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="remember-me" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="text-primarycolor-500 "
              />
              <label htmlFor="remember-me" className="cursor-pointer">Remember me </label>
            </div>
            <a href="/reset-password" className="text-primarycolor-500 hover:text-primarycolor-600 transition-colors">Forgot Password?</a>
          </div>


          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-8 bg-primarycolor-500 hover:bg-primarycolor-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-md transition-colors duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-12 w-12 animate-spin" />
                
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-700 text-base">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-primarycolor-500 hover:text-primarycolor-600 font-medium transition-colors duration-300"
          >
            Create an Account
          </a>
        </p>
      </div>
    </div>
      
    </div>
  );
}

export default Login;
