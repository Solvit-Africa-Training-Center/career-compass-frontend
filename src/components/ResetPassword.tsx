import { useState } from 'react';
import { Input } from './ui/Input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '@/hooks/useAuth';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
      })
      const [showOldPassword, setShowOldPassword] = useState(false)
      const [showNewPassword, setShowNewPassword] = useState(false)
      const [showConfirmPassword, setShowConfirmPassword] = useState(false)
      const { loading, changePassword } = useAuth()
      
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      
      const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          
          if (formData.new_password !== formData.confirm_password) {
            alert("New passwords don't match!");
            return;
          }
          
          await changePassword({
            old_password: formData.old_password,
            new_password: formData.new_password
          });
          
          // Reset form on success
          setFormData({
            old_password: "",
            new_password: "",
            confirm_password: ""
          });
        };
  return (
    <>
      <div>
        <h1 className='text-2xl font-bold mb-6 text-primarycolor-500 text-center'>Reset your Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">Old Password</label>
            <Input
              type={showOldPassword ? "text" : "password"}
              name="old_password"
              placeholder="Enter your current password"
              value={formData.old_password}
              onChange={handleChange}
              className="h-12 text-base pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">New Password</label>
            <Input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              placeholder="Enter your new password"
              value={formData.new_password}
              onChange={handleChange}
              className="h-12 text-base pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">Confirm New Password</label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              placeholder="Confirm your new password"
              value={formData.confirm_password}
              onChange={handleChange}
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
            disabled={loading}
            className="w-full h-12 mt-8 bg-primarycolor-500 hover:bg-primarycolor-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-md transition-colors duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
