import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

const Testimony = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDark } = useTheme()
  const testimonials = [
    {
      name: "Ineza Mark",
      role: "Biology student",
      avatar: "welcome1.jpg",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Uwase Monique", 
      role: "Student",
      avatar: "welcome1.jpg",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Abdul Aziz",
      role: "Agent", 
      avatar: "welcome1.jpg",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Sarah Johnson",
      role: "Student",
      avatar: "welcome1.jpg", 
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    },
    {
      name: "Mike Chen",
      role: "Student",
      avatar: "welcome1.jpg",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'standard Lorem Ipsum has been the industry'standard."
    }
  ];

  const totalSlides = Math.ceil(testimonials.length / 3);

  return (
    <div className={`max-w-7xl mx-auto px-4 py-12 transition-colors ${isDark ? 'bg-primarycolor-900' : 'bg-white'}`}>
      <h2 className="text-3xl font-bold text-center text-primarycolor-500 mb-12">What they say about us</h2>
      
      <div className="overflow-hidden py-12">
        <div 
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial, index) => (
                <div key={index} className={`rounded-2xl shadow-lg p-6 transition-colors ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center mb-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{testimonial.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.role}</p>
                    </div>
                  </div>
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-400">★★★★☆</div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Reviewed on 01.09.2025</span>
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
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-yellow-400' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimony;