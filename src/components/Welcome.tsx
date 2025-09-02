import React from 'react';
import { Button } from './ui/Button';

const Welcome = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <h1 className="font-bold text-primarycolor-500 text-3xl md:text-4xl lg:text-4xl uppercase mb-6 leading-tight">
              Navigate Your Educational Journey with Confidence
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed">
              Connect students with perfect academic programs worldwide. Our AI-powered platform matches profiles, predicts eligibility, and guides career decisions for students, institutions, and recruiters.
            </p>
            <Button className="bg-primarycolor-500 hover:bg-primarycolor-700 text-white font-semibold py-5 px-5 rounded-md transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Register Now
            </Button>
          </div>
          
          {/* Image Content */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="bg-white p-6 rounded-2xl shadow-2xl transform rotate-2">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522881193457-37ae97c905bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Students collaborating on education journey"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondarycolor-300 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primarycolor-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;