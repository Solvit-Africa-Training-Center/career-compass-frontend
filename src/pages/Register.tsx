import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const { register, loading, errors } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full rounded-2xl shadow-xl border px-8 md:px-12 py-12 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold uppercase text-center text-primarycolor-500 mb-3">
          Welcome to Career Compass
        </h1>
        <p className="text-center text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
          Let’s create your account to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12 text-base"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="h-12 text-base pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirm Password
            </label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="h-12 text-base pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors && <p className="text-red-500 text-sm">{errors}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-8 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-semibold text-base rounded-md transition-colors duration-300"
          >
            {loading ? "Creating account..." : "Create an account"}
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-700 text-base">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primarycolor-500 hover:text-primarycolor-600 font-medium transition-colors duration-300"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
