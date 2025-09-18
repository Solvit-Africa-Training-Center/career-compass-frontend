// REB Learning Pathways
export type REBPathway = 
  | 'mathematics_science_1' 
  | 'mathematics_science_2' 
  | 'arts_humanities' 
  | 'languages';

// Transcript and Academic Data
export interface Subject {
  id: string;
  name: string;
  grade: string;
  creditHours: number;
  semester: string;
  year: number;
}

export interface Transcript {
  id: string;
  subjects: Subject[];
  gpa: number;
  totalCredits: number;
  institution: string;
  studentId: string;
  createdAt: Date;
  rebPathway?: REBPathway;
}

// Personality Assessment
export interface PersonalityQuestion {
  id: string;
  question: string;
  type: 'scale';
  category: REBPathway;
  weight: number;
}

export type PersonalityCategory = REBPathway;

export interface PersonalityResponse {
  questionId: string;
  answer: string | number | boolean;
}

export interface PersonalityProfile {
  id: string;
  responses: PersonalityResponse[];
  scores: {
    [key in PersonalityCategory]: number;
  };
  dominantTraits: PersonalityCategory[];
  completedAt: Date;
}

// Career and Major Recommendations
export interface Major {
  id: string;
  name: string;
  description: string;
  requiredGPA: number;
  requiredSubjects: string[];
  relatedCareers: string[];
  rebPathway: REBPathway;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Very Hard';
  duration: number;
  averageSalary: {
    entry: number;
    mid: number;
    senior: number;
  };
  rwandanUniversities: string[];
}

export interface CareerRecommendation {
  id: string;
  major: Major;
  matchPercentage: number;
  academicMatch: number;
  personalityMatch: number;
  pathwayAlignment: number;
  explanation: string;
  strengths: string[];
  considerations: string[];
  nextSteps: string[];
}

// Multi-step Form State
export interface CareerGuidanceFormData {
  step: number;
  transcript: Transcript | null;
  personalityProfile: PersonalityProfile | null;
  recommendations: CareerRecommendation[];
  isComplete: boolean;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

// Component Props
export interface TranscriptFormProps {
  onSubmit: (transcript: Transcript) => void;
  initialData?: Transcript;
}

export interface PersonalityAssessmentProps {
  onSubmit: (profile: PersonalityProfile) => void;
  questions: PersonalityQuestion[];
}

export interface RecommendationsProps {
  recommendations: CareerRecommendation[];
  onRetake: () => void;
  onModifyTranscript: () => void;
}

export interface ProgressIndicatorProps {
  steps: FormStep[];
  currentStep: number;
}

// Validation schemas
export interface TranscriptValidation {
  hasValidGrades: boolean;
  hasMinimumCredits: boolean;
  hasValidGPA: boolean;
  errors: string[];
}

export interface PersonalityValidation {
  isComplete: boolean;
  missingQuestions: string[];
  errors: string[];
}
