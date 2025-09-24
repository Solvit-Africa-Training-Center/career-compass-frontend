import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Check } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CallApi from "@/utils/callApi";
import { backend_path } from "@/utils/enum";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

interface ProgramDetail {
  id: string;
  name: string;
  description: string;
  duration?: string;
  language?: string;
  level?: string;
  institution: {
    id: string;
    name: string;
    location: string;
  };
  campuses: Array<{
    id: number;
    name: string;
    location: string;
  }>;
  intakes: Array<{
    id: string;
    intake_date: string;
    deadline: string;
    available_seats: number;
    status: string;
  }>;
  fees: Array<{
    id: number | string;
    tuition_amount: string;
    currency: string;
    application_fee: string;
    deposit_amount: string;
    living_expenses: string;
  }>;
  requirements: Array<{
    id: number | string;
    minimum_gpa: string;
    required_documents: string;
    language_requirements: string;
  }>;
  features: Array<{
    id: number | string;
    feature_text: string;
  }>;
}

// API shapes based on provided schemas
interface ProgramApi {
  id: string;
  institution_id: string;
  name: string;
  description: string;
  duration: number;
  language: string;
  is_active: boolean;
  institution: string;
}

interface InstitutionApi {
  id: string;
  official_name: string;
  aka: string;
  type: string;
  country: string;
  website: string;
  is_verified: boolean;
  is_active: boolean;
}

interface IntakeApi {
  id: string;
  program_id: string;
  start_month: string;
  application_deadline: string;
  seats: number;
  is_open: boolean;
  is_active: boolean;
  program: string;
}

interface FeeApi {
  id: number;
  tuition_fee: string;
  tuition_amount: string;
  tuition_currency: string;
  application_fee_amount: string;
  deposit_amount: string;
  has_scholarship: boolean;
  scholarship_percent: string;
  is_active: boolean;
  program: string;
}

interface RequirementApi {
  id: number;
  min_gpa: string;
  other_requirements: string;
  is_active: boolean;
  program: string;
}

interface FeatureApi {
  program: string;
  features: string;
  is_active: boolean;
}

interface CampusApi {
  id: number;
  name: string;
  city: string;
  address: string;
  is_active: boolean;
  institution: string;
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
      // Fetch all required datasets in parallel
      const [programsRes, institutionsRes, intakesRes, feesRes, requirementsRes, featuresRes, campusesRes] = await Promise.all([
        CallApi.get(backend_path.GET_PROGRAM),
        CallApi.get(backend_path.GET_INSTITUTION),
        CallApi.get(backend_path.GET_PROGRAM_INTAKE),
        CallApi.get(backend_path.GET_PROGRAM_FEE),
        CallApi.get(backend_path.GET_ADMISSION_REQUIREMENT),
        CallApi.get(backend_path.GET_FEATURE),
        CallApi.get(backend_path.GET_CAMPUS)
      ]);

      const programs: ProgramApi[] = (programsRes.data.results || programsRes.data || []) as ProgramApi[];
      const institutions: InstitutionApi[] = (institutionsRes.data.results || institutionsRes.data || []) as InstitutionApi[];
      const intakes: IntakeApi[] = (intakesRes.data.results || intakesRes.data || []) as IntakeApi[];
      const fees: FeeApi[] = (feesRes.data.results || feesRes.data || []) as FeeApi[];
      const requirements: RequirementApi[] = (requirementsRes.data.results || requirementsRes.data || []) as RequirementApi[];
      const features: FeatureApi[] = (featuresRes.data.results || featuresRes.data || []) as FeatureApi[];
      const campuses: CampusApi[] = (campusesRes.data.results || campusesRes.data || []) as CampusApi[];

      const programData = programs.find(p => p.id === id);
      if (!programData) {
        setProgram(null);
        return;
      }

      const institution = institutions.find(i => i.id === programData.institution_id) || null;
      const programIntakes = intakes
        .filter(it => (it.program_id || it.program) === id)
        .sort((a, b) => new Date(b.application_deadline).getTime() - new Date(a.application_deadline).getTime());

      const programFees = fees.filter(f => f.program === id);
      const programRequirements = requirements.filter(r => r.program === id);
      const programFeatures = features.filter(f => f.program === id);
      const institutionCampuses = campuses.filter(c => c.institution === programData.institution_id);

      const composed: ProgramDetail = {
        id: programData.id,
        name: programData.name,
        description: programData.description,
        duration: programData.duration != null ? String(programData.duration) : undefined,
        language: programData.language,
        level: undefined,
        institution: {
          id: institution?.id || programData.institution_id,
          name: institution?.official_name || institution?.aka || 'Unknown Institution',
          location: institution?.country || ''
        },
        campuses: institutionCampuses.map(c => ({ id: c.id, name: c.name, location: c.city })),
        intakes: programIntakes.map(it => ({
          id: it.id,
          intake_date: it.start_month,
          deadline: it.application_deadline,
          available_seats: Number(it.seats || 0),
          status: it.is_open ? 'open' : 'closed'
        })),
        fees: programFees.map(f => ({
          id: f.id,
          tuition_amount: f.tuition_amount,
          currency: f.tuition_currency,
          application_fee: f.application_fee_amount,
          deposit_amount: f.deposit_amount,
          living_expenses: ''
        })),
        requirements: programRequirements.map(r => ({
          id: r.id,
          minimum_gpa: r.min_gpa,
          required_documents: r.other_requirements,
          language_requirements: ''
        })),
        features: programFeatures.map((f, idx) => ({ id: idx, feature_text: f.features }))
      };

      setProgram(composed);
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

  const hasAnyRequirement = Boolean(
    (requirements && requirements.minimum_gpa && requirements.minimum_gpa.trim() !== '') ||
    (requirements && requirements.language_requirements && requirements.language_requirements.trim() !== '') ||
    (requirements && requirements.required_documents && requirements.required_documents.trim() !== '')
  );

  const campusLocation = program.campuses?.[0]?.location || program.institution?.location || '';

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <div className="flex flex-col md:flex-row rounded-xl overflow-hidden bg-[#0E4091]">
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
              <CardHeader className="p-0">
                {program.institution?.name && (
                  <p className="text-[#FBBC04] text-sm font-medium">
                    {program.institution.name}
                  </p>
                )}
                <CardTitle className="text-white text-3xl font-bold">
                  {program.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {program.description && (
                  <p className="text-white text-base mb-4">
                    {program.description}
                  </p>
                )}
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

        {/* Program Overview */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{program.name}</h2>
            {program.description && (
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {program.description}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {program.duration && (
                  <li>
                    <b>Duration:</b> {program.duration}
                  </li>
                )}
                {program.level && (
                  <li>
                    <b>Level:</b> {program.level}
                  </li>
                )}
                {program.language && (
                  <li>
                    <b>Language:</b> {program.language}
                  </li>
                )}
                {campusLocation && (
                  <li>
                    <b>Campus:</b> {campusLocation}
                  </li>
                )}
              </ul>
              <ul className={`space-y-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {program.features && program.features.length > 0 && (
                  program.features.slice(0, 3).map((feature, index) => (
                    <li key={`${feature.id}-${index}`}>
                      <span className="text-green-500">✓</span> {feature.feature_text}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Admission Requirements */}
        {hasAnyRequirement && (
          <div className={`${isDark ? 'bg-primarycolor-900' : 'bg-white'} p-6 rounded-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admission Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Academic Requirements</h3>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                  {requirements?.minimum_gpa && (
                    <li className="flex items-center">
                      <span className="text-[#0E4091] mr-2">•</span> Minimum GPA: {requirements.minimum_gpa}
                    </li>
                  )}
                </ul>
              </div>
              {requirements?.language_requirements && (
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Language Requirements</h3>
                  <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    {requirements.language_requirements.split(',').map((req, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-[#0E4091] mr-2">•</span> {req.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {requirements?.required_documents && (
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Required Documents</h3>
                  <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    {requirements.required_documents.split(',').map((doc, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-[#0E4091] mr-2">•</span> {doc.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fees & Program Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fees && (
            <div className={`${isDark ? 'bg-primarycolor-900' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Fees Structure (Per Year)</h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                {fees.tuition_amount && (
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                    <p className="text-xl font-bold text-[#0E4091]">
                      {(fees.currency || '$')}{fees.tuition_amount}
                    </p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Tuition Fee</p>
                  </div>
                )}
                {fees.deposit_amount && (
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                    <p className="text-xl font-bold text-[#0E4091]">
                      {(fees.currency || '$')}{fees.deposit_amount}
                    </p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Deposit</p>
                  </div>
                )}
                {fees.application_fee && (
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                    <p className="text-xl font-bold text-red-500">
                      {(fees.currency || '$')}{fees.application_fee}
                    </p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Application Fee</p>
                  </div>
                )}
                {fees.living_expenses && (
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                    <p className="text-xl font-bold text-green-600">
                      {(fees.currency || '$')}{fees.living_expenses}
                    </p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Living Expenses</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(campusLocation || latestIntake?.deadline || (latestIntake && latestIntake.available_seats > 0) || latestIntake?.status) && (
            <div className={`${isDark ? 'bg-primarycolor-900' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Program features</h2>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {campusLocation && (
                  <li className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#0E4091]" /> 
                    {campusLocation}
                  </li>
                )}
                {latestIntake?.deadline && (
                  <li className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#0E4091]" /> 
                    {new Date(latestIntake.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </li>
                )}
                {latestIntake && latestIntake.available_seats > 0 && (
                  <li className="flex items-center gap-2">
                    <Users size={16} className="text-[#0E4091]" /> 
                    {latestIntake.available_seats} seats remain
                  </li>
                )}
                {latestIntake?.status && (
                  <li className="flex items-center gap-2">
                    <Clock size={16} className="text-[#0E4091]" /> 
                    {latestIntake.status === 'open' ? 'Applications open' : 'Applications closed'}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Available Intakes */}
        {program.intakes && program.intakes.length > 0 && (
          <div className={`${isDark ? 'bg-primarycolor-900' : 'bg-white'} p-6 rounded-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Available Intakes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                {program.intakes.map((intake) => {
                  const intakeDate = intake.intake_date;
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
                      {intakeDate} ({isOpen ? hasLimitedSeats ? 'Limited Seats' : 'Open' : 'Closed'})
                    </Badge>
                  );
                })}
              </div>
              <div className="flex flex-col gap-2 font-semibold">
                {program.intakes.map((intake) => {
                  const deadline = new Date(intake.deadline);
                  return (
                    <div key={`deadline-${intake.id}`} className="bg-[#FBBC04] text-[#0E4091] rounded-md py-1 px-3">
                      Deadline: {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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