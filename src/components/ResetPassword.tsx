import React, { useState } from 'react';
import { Input } from './ui/Input';
import type { User } from '@/types';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '@/hooks/useAuth';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email:"",
        password:"",
      })
      const [showPassword, setShowPassword] = useState(false)
      const {loading}=useAuth()
      const handleChange=(
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof User
      ) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
      };
      const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
        //   login(formData)
          console.log("Login form submitted");
        };
  return (
    <>
      <div>
        <h1 className='text-2xl font-bold mb-6 text-primarycolor-500 text-center'>Reset your Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">Old Password</label>
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
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">New Password</label>
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
              "Reset"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
