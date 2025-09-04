import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import type { Users } from "@/types";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<Users>({
    // userId: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Users | "confirmPassword"
  ) => {
    const { value } = e.target;
    if (field === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // API call can go here later

    console.log("Register form:", form);
    navigate("/email-verification");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full rounded-2xl shadow-xl border px-8 md:px-12 py-12 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold uppercase text-center text-primarycolor-500 mb-3">
        Welcome to Career Compass
      </h1>
        <p className="text-center text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
        Are you ready to make something great? Let’s get your account created to
        make something great.
      </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={form.email}
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
              value={form.password}
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

          {/* Confirm Password field with toggle */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirm Password
            </label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => handleChange(e, "confirmPassword")}
              className="h-12 text-base pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-8 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-semibold text-base rounded-md transition-colors duration-300"

          >
            Create an account
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
