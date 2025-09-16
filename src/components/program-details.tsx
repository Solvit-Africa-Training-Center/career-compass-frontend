import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Check } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CallApi from "@/utils/CallApi";
import { backend_path } from "@/utils/enum";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

interface ProgramDetail {
  id: number;
  name: string;
  description: string;
  duration: string;
  language: string;
  level: string;
  institution: {
    id: number;
    name: string;
    location: string;
  };
  campuses: Array<{
    id: number;
    name: string;
    location: string;
  }>;
  intakes: Array<{
    id: number;
    intake_date: string;
    deadline: string;
    available_seats: number;
    status: string;
  }>;
  fees: Array<{
    id: number;
    tuition_amount: string;
    currency: string;
    application_fee: string;
    deposit_amount: string;
    living_expenses: string;
  }>;
  requirements: Array<{
    id: number;
    minimum_gpa: string;
    required_documents: string;
    language_requirements: string;
  }>;
  features: Array<{
    id: number;
    feature_text: string;
  }>;
}

function ProgramDetails() {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProgramDetails();
    }
  }, [id]);

  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      const response = await CallApi.get(`${backend_path.GET_PROGRAM_ID}${id}/`);
      setProgram(response.data);
    } catch (error) {
      console.error('Error fetching program details:', error);
      toast.error('Failed to load program details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 space-y-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (!program) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
          <p className="text-gray-600 mb-4">The program you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </ScrollArea>
    );
  }

  const latestIntake = program.intakes?.[0];
  const fees = program.fees?.[0];
  const requirements = program.requirements?.[0];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Hero Section with Eligibility Check */}
        <div className="relative">
          <div className="flex flex-col md:flex-row rounded-xl overflow-hidden bg-[#0E4091]">
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
              <CardHeader className="p-0">
                <p className="text-[#FBBC04] text-sm font-medium">
                  {program.institution?.name}
                </p>
                <CardTitle className="text-white text-3xl font-bold">
                  {program.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-white text-base mb-4">
                  {program.description || 'Comprehensive program designed to provide students with essential knowledge and skills in their chosen field of study.'}
                </p>
                <Button className="bg-[#FBBC04] text-[#0E4091] hover:bg-[#e0a903] font-bold">
                  Apply Now
                </Button>
              </CardContent>
            </div>
            <img
              src="/src/assets/img.jpg"
              alt="Program details"
              className="w-full md:w-1/3 h-64 md:h-auto object-cover"
            />
          </div>
          <Button className="absolute top-4 right-4 bg-blue-600 text-white rounded-full h-auto w-auto p-2">
            <Check size={16} />
          </Button>
        </div>

        {/* Program Overview and Eligibility Check Button */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{program.name}</h2>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {program.description || 'Comprehensive program designed to provide students with essential knowledge and skills in their chosen field of study.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>
                  <b>Duration:</b> {program.duration || 'Not specified'}
                </li>
                <li>
                  <b>Level:</b> {program.level || 'Not specified'}
                </li>
                <li>
                  <b>Study mode:</b> Full-time
                </li>
                <li>
                  <b>Language:</b> {program.language || 'English'}
                </li>
                <li>
                  <b>Campus:</b> {program.campuses?.[0]?.location || program.institution?.location || 'Not specified'}
                </li>
              </ul>
              <ul className={`space-y-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {program.features?.slice(0, 3).map((feature, index) => (
                  <li key={feature.id}>
                    <span className="text-green-500">✓</span> {feature.feature_text}
                  </li>
                )) || [
                  <li key="1"><span className="text-green-500">🏠</span> On-campus housing available</li>,
                  <li key="2"><span className="text-green-500">💼</span> Internship opportunities</li>,
                  <li key="3"><span className="text-green-500">🚌</span> Campus shuttle service</li>
                ]}
              </ul>
            </div>
          </div>
          <Button className="ml-4 bg-blue-600 text-white flex items-center gap-2">
            <Check size={16} />
            Eligibility check
          </Button>
        </div>

        {/* Admission Requirements */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-primarycolor-900' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admission Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Academic Requirements</h3>
              <ul className={`space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> High school diploma or equivalent
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Minimum GPA: {requirements?.minimum_gpa || '3.0/4.0'}
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Mathematics: Pre-Calculus
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Science: Physics etc
                </li>
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Language Requirements</h3>
              <ul className={`space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {requirements?.language_requirements ? (
                  requirements.language_requirements.split(',').map((req, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> {req.trim()}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> TOEFL: 80+ iBT
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> IELTS: 6.5+
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> SAT: 1200+
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Required Documents</h3>
              <ul className={`space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {requirements?.required_documents ? (
                  requirements.required_documents.split(',').map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> {doc.trim()}
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> High School Diploma
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> Official Transcript
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> Passport Copy
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> English Proficiency Test
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> Letter of Recommendation
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Fees & Program Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${isDark ? 'bg-primarycolor-900' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Fees Structure (Per Year)</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xl font-bold text-[#0E4091]">
                  {fees?.currency || '$'}{fees?.tuition_amount || '45,000'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Tuition Fee</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xl font-bold text-[#0E4091]">
                  {fees?.currency || '$'}{fees?.deposit_amount || '2,500'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Deposit</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xl font-bold text-red-500">
                  {fees?.currency || '$'}{fees?.application_fee || '105'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Application Fee</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xl font-bold text-green-600">
                  {fees?.currency || '$'}{fees?.living_expenses || '18,000'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Living Expenses</p>
              </div>
            </div>
          </div>
          <div className={`p-6 rounded-lg ${isDark ? 'bg-primarycolor-900' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Program features</h2>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#0E4091]" /> 
                {program.campuses?.[0]?.location || program.institution?.location || 'Location not specified'}
              </li>
              <li className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0E4091]" /> 
                {latestIntake?.deadline ? new Date(latestIntake.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Deadline not specified'}
              </li>
              <li className="flex items-center gap-2">
                <Users size={16} className="text-[#0E4091]" /> 
                {latestIntake?.available_seats || 0} seats remain
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-[#0E4091]" /> 
                {latestIntake?.status === 'open' ? 'Applications open' : 'Applications closed'}
              </li>
            </ul>
          </div>
        </div>

        {/* Available Intakes */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-primarycolor-900' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Available Intakes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              {program.intakes?.length > 0 ? (
                program.intakes.map((intake) => {
                  const intakeDate = new Date(intake.intake_date);
                  const isOpen = intake.status === 'open';
                  const hasLimitedSeats = intake.available_seats < 50;
                  
                  return (
                    <Badge 
                      key={intake.id}
                      className={`font-semibold rounded-md py-1 px-3 ${
                        isOpen 
                          ? hasLimitedSeats 
                            ? 'bg-[#FBBC04] text-white' 
                            : 'bg-green-600 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {intakeDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} 
                      ({isOpen ? hasLimitedSeats ? 'Limited Seats' : 'Open' : 'Closed'})
                    </Badge>
                  );
                })
              ) : (
                <>
                  <Badge className="bg-green-600 text-white font-semibold rounded-md py-1 px-3">
                    Fall 2026 - September (Open)
                  </Badge>
                  <Badge className="bg-gray-400 text-white font-semibold rounded-md py-1 px-3">
                    Winter 2027 - January (Closed)
                  </Badge>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2 font-semibold">
              {program.intakes?.length > 0 ? (
                program.intakes.map((intake) => {
                  const deadline = new Date(intake.deadline);
                  return (
                    <div key={`deadline-${intake.id}`} className="bg-[#FBBC04] text-[#0E4091] rounded-md py-1 px-3">
                      Deadline: {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="bg-[#FBBC04] text-[#0E4091] rounded-md py-1 px-3">
                    Deadline: Fall - May 1st
                  </div>
                  <div className="bg-[#FBBC04] text-[#0E4091] rounded-md py-1 px-3">
                    Deadline: Winter - Oct 1st
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-[#0E4091] text-white font-bold px-8 hover:bg-[#0E4091]/90">
            Apply
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 px-8 hover:bg-gray-100"
            onClick={() => { window.history.back(); }}
          >
            Back to Programs
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

export default ProgramDetails;