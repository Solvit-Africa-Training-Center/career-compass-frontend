import React, { useState } from 'react';

const Testimony = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Ineza Mark",
      role: "Biology student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Uwase Monique", 
      role: "Retailer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Abdul Aziz",
      role: "Photographer", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Sarah Johnson",
      role: "Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", 
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Mike Chen",
      role: "Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    }
  ];

  const totalSlides = Math.ceil(testimonials.length / 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primarycolor-500 mb-12">What they say about us</h2>
      
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-400">★★★★☆</div>
                    <span className="text-gray-400 text-sm">Reviewed on 01.09.2025</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-yellow-400' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimony;