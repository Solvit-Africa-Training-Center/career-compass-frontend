import React from 'react';
import { Button } from './ui/Button';

const Welcome = () => {
  return (
    <div className="py-8 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="font-bold text-primarycolor-500 text-2xl md:text-3xl lg:text-4xl uppercase mb-4 md:mb-6 leading-tight">
              Navigate Your Educational Journey with Confidence
            </h1>
            <p className="text-gray-700 text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Connect students with perfect academic programs worldwide. Our AI-powered platform matches profiles, predicts eligibility, and guides career decisions for students, institutions, and recruiters.
            </p>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-700 text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-md transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Register Now
            </Button>
            
          </div>
          
          {/* Image Content */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl transform rotate-1 lg:rotate-2">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden">
                  <img 
                    src="./src/assets/welcome1.jpg"
                    alt="Students collaborating on education journey"
                    className="w-full h-48 md:h-64 lg:h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-16 h-16 md:w-24 md:h-24 bg-secondarycolor-300 rounded-full opacity-20"></div>
              <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-12 h-12 md:w-16 md:h-16 bg-primarycolor-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;