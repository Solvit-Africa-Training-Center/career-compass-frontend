import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import LogoHeader from "./LogoHeader";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader } from "lucide-react";
const EmailVerification = () => {
  const navigate = useNavigate();
  const { verifyOTP, resendOTP, loading, registeredEmail } = useAuth();
  const [otp, setOtp] = useState("");
  const email = registeredEmail || "user@example.com";



  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (otp.length !== 6) {
        toast.error("Please enter complete OTP");
        return;
      }

      await verifyOTP({ email, otp });
    },
    [otp, email, verifyOTP]
  );

  const handleResend = useCallback(async () => {
    await resendOTP(email);
    setOtp("");
  }, [email, resendOTP]);

  return (
    <div className="min-h-screen">
      <LogoHeader />
      <div className=" flex items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full rounded-2xl shadow-xl border px-8 md:px-12 py-12 bg-white">
          <h1 className="text-primarycolor-500 text-2xl md:text-3xl text-center uppercase font-bold mb-4">
            OTP Verification
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter the 6-digit code sent to your email
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              type="hidden"
              value={email}
              readOnly
              aria-hidden="true"
            />
            
            <div className="flex justify-center mt-6">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={(value) => setOtp(value)}
                className="gap-2 md:gap-3"
              >
                <InputOTPGroup className="gap-2 md:gap-3">
                  <InputOTPSlot index={0} className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-semibold" />
                  <InputOTPSlot index={1} className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-semibold" />
                  <InputOTPSlot index={2} className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-semibold" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2 md:gap-3">
                  <InputOTPSlot index={3} className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-semibold" />
                  <InputOTPSlot index={4} className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-semibold" />
                  <InputOTPSlot index={5} className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-semibold" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-primarycolor-500 hover:bg-primarycolor-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-md transition-colors duration-300"
              >
                {/* {loading ? "Verifying..." : "Verify"} */}
                {loading ? (
              <>
                <Loader className="mr-2 h-12 w-12 animate-spin" />
                
              </>
            ) : (
              "Verify"
            )}
              </Button>
              <Button
                type="button"
                className="w-full h-12 bg-white text-primarycolor-500 border border-primarycolor-500 hover:bg-primarycolor-50 font-semibold text-base rounded-md transition-colors duration-300"
                onClick={() => navigate("/login")}
              >
                Cancel
              </Button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{" "}
              <Button
                variant="link"
                onClick={handleResend}
                disabled={loading}
                className="p-0 h-auto font-medium disabled:opacity-50"
              >
                {loading ? "Sending..." : "Resend OTP"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
