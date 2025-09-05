import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import  LogoHeader from './LogoHeader';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only allow digits
    
    setOtp(prev => {
      const newOtp = [...prev];
      newOtp[index] = value.slice(-1);
      return newOtp;
    });
    
    // auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array(6).fill('');
    
    [...pastedData].forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }
    
    console.log('OTP:', otpValue);
    // Add your verification logic here
  }, [otp]);

  const handleResend = useCallback(() => {
    console.log('Resending OTP...');
    setOtp(Array(6).fill(''));
    inputRefs.current[0]?.focus();
    // Add your resend logic here
  }, []);

  return (
    <>
    <LogoHeader />
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full rounded-2xl shadow-xl border px-8 md:px-12 py-12 bg-white">
        <h1 className="text-primarycolor-500 text-2xl md:text-3xl text-center uppercase font-bold mb-4">
          OTP Verification
        </h1>
        <p className="text-gray-600 text-center mb-8">
            Enter the 6-digit code sent to your email

        </p>
        <form onSubmit={handleSubmit}>
<div className="flex justify-center gap-2 md:gap-3 mt-6">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoComplete='one-time-code'
              className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primarycolor-500 focus:outline-none transition-colors"
              maxLength={1}
            />
          ))}
        </div>
        
        <div className="flex flex-col gap-4 mt-8">
          <Button
            type="submit"
            className="w-full h-12 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-semibold text-base rounded-md transition-colors duration-300"
          >
            Verify and Continue
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
            Didn't receive the code?{' '}
            <Button
              variant="link"
              onClick={handleResend}
              className="p-0 h-auto font-medium"
            >
              Resend OTP
            </Button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default EmailVerification;