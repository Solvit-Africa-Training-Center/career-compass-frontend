import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const navigate =useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full rounded-2xl shadow-xl border px-8 md:px-12 py-12 bg-white">
        <h1 className='text-primarycolor-500 text-2xl md:text-3xl text-center uppercase font-bold mb-4'>OTP Verification</h1>
        <p className='text-gray-600 text-center mb-8'>Enter verification code we've sent to your email, be careful not to share the code with anyone</p>
        <div className='flex justify-center gap-2 md:gap-3 mt-6'>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type='text'
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className='w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primarycolor-500 focus:outline-none transition-colors'
              maxLength={1}
            />
          ))}
          
        </div>
        <div className='flex flex-col  gap-4 mt-8'>
          <Button
            type="submit"
            className="w-full h-12 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-semibold text-base rounded-md transition-colors duration-300"
          >
            Verify and Continue
          </Button>
          <Button
            type="button"
            className="w-full h-12 bg-white text-primarycolor-500 border border-primarycolor-500 hover:bg-white font-semibold text-base rounded-md transition-colors duration-300"
            onClick={() => navigate("/login")}
          >
            Cancel
          </Button>
        </div>
          <p className="mt-8 text-center text-gray-700 text-base">
          Didn’t receive OTP code ?{" "}
          <a
            href="/login"
            className="text-primarycolor-500 hover:text-primarycolor-600 font-medium transition-colors duration-300"
          >
            Resend OTP
          </a>
        </p>
      </div>
    </div>
  );
}

export default EmailVerification;