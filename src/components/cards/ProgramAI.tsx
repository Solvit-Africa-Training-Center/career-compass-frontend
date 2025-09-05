import React from "react";
import {
  GraduationCap,
  SearchCheck,
  Brain,
  Compass,
  FileText,
  Network,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center hover:shadow-md transition-all">
      <div className="flex justify-center mb-4 text-blue-600">{icon}</div>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const ProgramAI: React.FC = () => {
  const features = [
    {
      icon: <GraduationCap size={36} className="text-primarycolor-500"/>,
      title: "AI Profile Analysis",
      description:
        "Advanced natural language processing analyzes your interests, skills, and goals to create a tailored academic profile.",
    },
    {
      icon: <SearchCheck size={36} className="text-primarycolor-500" />,
      title: "Program Matching",
      description:
        "Semantic similarity algorithms compare your profile with thousands of programs to find perfect matches.",
    },
    {
      icon: <Brain size={36} className="text-primarycolor-500"/>,
      title: "Eligibility Prediction",
      description:
        "Machine learning models analyze admission requirements to predict acceptance chances before you apply.",
    },
    {
      icon: <Compass size={36} className="text-primarycolor-500"/>,
      title: "AI Career Guidance",
      description:
        "Get personalized advice through our intelligent Q&A system that understands your goals and provides guidance.",
    },
    {
      icon: <FileText size={36} className="text-primarycolor-500"/>,
      title: "Intelligent Reports",
      description:
        "AI-generated summaries help you understand your options, track progress, and make informed decisions.",
    },
    {
      icon: <Network size={36} className="text-primarycolor-500"/>,
      title: "Wide Network",
      description:
        "Access thousands of institutions worldwide with real-time data synchronization and up-to-date information.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our intelligent algorithms analyze your profile, predict eligibility,
            and match you with the perfect educational opportunities.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramAI;
