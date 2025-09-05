import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import LogoHeader from "./LogoHeader";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate()
  return (
    <>
      <LogoHeader />
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full rounded-2xl shadow-xl border px-8 md:px-12 py-12 bg-white">
          <div className="flex items-center gap-4 mb-6">
            <ArrowLeft 
              className="w-5 h-5 md:w-6 md:h-6 text-gray-600 cursor-pointer flex-shrink-0" 
              onClick={() => navigate('/login')} 
            />
            <h1 className="text-primarycolor-500 text-xl md:text-2xl lg:text-3xl text-center uppercase font-bold flex-1">
              Reset Password
            </h1>
          </div>
          
          <LockKeyhole className="w-10 h-10 md:w-12 md:h-12 mx-auto text-primarycolor-500 mb-4" />
          <p className="text-sm md:text-base text-center mb-2">Forgot your password?</p>
          <p className="text-sm md:text-base text-center mb-6 text-gray-600">
            No worries! Enter your email below and we'll send you a link to reset it.
          </p>
          
          <form className="space-y-4">
            <Input 
              type="email"
              placeholder="Enter your email"
              className="h-12 text-base"
              required
            />
            <Button
              type="submit"
              className="w-full h-12 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-semibold text-base rounded-md transition-colors duration-300"
            >
              Send Reset Link
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
