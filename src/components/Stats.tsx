import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
};

const Stats = () => {
  return (
    <div className='bg-primarycolor-800 py-8 px-4'>
            <div className='max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>
                        <AnimatedCounter target={150} suffix="+" />
                    </h1>
                    <p className='text-white text-sm md:text-base'>Students Placed</p>
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>
                        <AnimatedCounter target={10} suffix="+" />
                    </h1>
                    <p className='text-white text-sm md:text-base'>Partner Institutions</p>
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>
                        <AnimatedCounter target={11} suffix="+" />
                    </h1>
                    <p className='text-white text-sm md:text-base'>Agents</p>
                </div>
                <div className='text-center space-y-2'>
                    <h1 className='text-secondarycolor-300 text-2xl md:text-3xl font-bold'>
                        <AnimatedCounter target={90} suffix="%" />
                    </h1>
                    <p className='text-white text-sm md:text-base'>Success Rate</p>
                </div>
            </div>
        </div>
  );
}

export default Stats;
