import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
// import { Button } from '@/ui/Button';

interface ProgramCardProps {
  title: string;
  description: string;
  buttonText: string;
  cardColor: string;
  buttonStyle: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  buttonText,
  cardColor,
  buttonStyle,
}) => {
  return (
    <div
      className={`rounded-xl shadow-md p-8 text-center flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardColor}`}
    >
      <div className="flex justify-center mb-4">
        <GraduationCap size={40} className="text-white" />
      </div>
      <h3 className="font-semibold text-lg md:text-xl text-white mb-3">
        {title}
      </h3>
      <p className="text-white mb-6">{description}</p>
      <Button
        className={`w-full py-2 rounded-lg flex items-center justify-center ${buttonStyle}`}
      >
        {buttonText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const ProgramSection: React.FC = () => {
  const programs = [
    {
      title: "I'm a student",
      description: 'Find your perfect program and school match',
      buttonText: 'Get started',
      cardColor: 'bg-blue-500',
      buttonStyle:
        'bg-transparent border border-white text-white hover:bg-white hover:text-blue-500',
    },
    {
      title: "I'm an Institution",
      description:
        'Showcase programs, manage applications, and connect with students',
      buttonText: 'Register',
      cardColor: 'bg-blue-600',
      buttonStyle: 'bg-yellow-400 text-black hover:bg-yellow-500',
    },
    {
      title: "I'm an Agent",
      description: 'Guide students, earn commissions, and access career tools',
      buttonText: 'Join Us',
      cardColor: 'bg-blue-500',
      buttonStyle:
        'bg-transparent border border-white text-white hover:bg-white hover:text-blue-500',
    },
  ];

  return (
    <section className="py-16 px-4 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primarycolor-500">
            Discover perfect career to pursue with our intelligent matching
            system.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
