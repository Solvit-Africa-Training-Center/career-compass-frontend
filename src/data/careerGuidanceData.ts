import type { PersonalityQuestion, Major, Subject } from '../types/career';

// REB Learning Pathways Assessment Questions
export const personalityQuestions: PersonalityQuestion[] = [
  // Mathematics & Science Stream 1
  {
    id: 'math_sci_1_1',
    question: 'I enjoy solving complex mathematical problems and equations',
    type: 'scale',
    category: 'mathematics_science_1',
    weight: 1
  },
  {
    id: 'math_sci_1_2',
    question: 'I find physics concepts and experiments fascinating',
    type: 'scale',
    category: 'mathematics_science_1',
    weight: 1
  },
  {
    id: 'math_sci_1_3',
    question: 'I prefer working with data, statistics, and logical analysis',
    type: 'scale',
    category: 'mathematics_science_1',
    weight: 1
  },

  // Mathematics & Science Stream 2
  {
    id: 'math_sci_2_1',
    question: 'I am interested in biological processes and living organisms',
    type: 'scale',
    category: 'mathematics_science_2',
    weight: 1
  },
  {
    id: 'math_sci_2_2',
    question: 'I enjoy chemistry experiments and understanding molecular structures',
    type: 'scale',
    category: 'mathematics_science_2',
    weight: 1
  },
  {
    id: 'math_sci_2_3',
    question: 'I am drawn to medical and health-related fields',
    type: 'scale',
    category: 'mathematics_science_2',
    weight: 1
  },
  {
    id: 'math_sci_2_4',
    question: 'I like applying mathematical concepts to real-world problems',
    type: 'scale',
    category: 'mathematics_science_2',
    weight: 1
  },

  // Arts & Humanities
  {
    id: 'arts_hum_1',
    question: 'I enjoy analyzing literature, history, and cultural topics',
    type: 'scale',
    category: 'arts_humanities',
    weight: 1
  },
  {
    id: 'arts_hum_2',
    question: 'I am interested in human behavior and social issues',
    type: 'scale',
    category: 'arts_humanities',
    weight: 1
  },
  {
    id: 'arts_hum_3',
    question: 'I prefer creative expression and artistic activities',
    type: 'scale',
    category: 'arts_humanities',
    weight: 1
  },
  {
    id: 'arts_hum_4',
    question: 'I enjoy debating and discussing philosophical concepts',
    type: 'scale',
    category: 'arts_humanities',
    weight: 1
  },

  // Languages
  {
    id: 'lang_1',
    question: 'I have a natural ability to learn and use different languages',
    type: 'scale',
    category: 'languages',
    weight: 1
  },
  {
    id: 'lang_2',
    question: 'I enjoy communicating and connecting with people from different cultures',
    type: 'scale',
    category: 'languages',
    weight: 1
  },
  {
    id: 'lang_3',
    question: 'I am interested in translation, interpretation, or international relations',
    type: 'scale',
    category: 'languages',
    weight: 1
  }
];

// Sample Academic Subjects
export const commonSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', grade: 'A', creditHours: 4, semester: 'Semester 1', year: 2023 },
  { id: '2', name: 'Physics', grade: 'B+', creditHours: 4, semester: 'Semester 1', year: 2023 },
  { id: '3', name: 'Chemistry', grade: 'A-', creditHours: 4, semester: 'Semester 2', year: 2024 },
  { id: '4', name: 'Biology', grade: 'B', creditHours: 3, semester: 'Semester 2', year: 2024 },
  { id: '5', name: 'English Literature', grade: 'A', creditHours: 3, semester: 'Semester 1', year: 2023 },
  { id: '6', name: 'History', grade: 'B+', creditHours: 3, semester: 'Semester 2', year: 2024 },
  { id: '7', name: 'Computer Science', grade: 'A+', creditHours: 4, semester: 'Semester 1', year: 2023 },
  { id: '8', name: 'Economics', grade: 'B', creditHours: 3, semester: 'Semester 2', year: 2024 }
];

// REB-Aligned Major Database
export const majorsDatabase: Major[] = [
  // Mathematics & Science Stream 1
  {
    id: 'cs',
    name: 'Computer Science',
    description: 'Programming, software development, and computational systems',
    requiredGPA: 3.2,
    requiredSubjects: ['Mathematics', 'Physics'],
    relatedCareers: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Systems Analyst'],
    rebPathway: 'mathematics_science_1',
    difficulty: 'Hard',
    duration: 4,
    averageSalary: { entry: 250000, mid: 800000, senior: 1300000 },
    rwandanUniversities: ['University of Rwanda', 'AUCA', 'Mount Kigali']
  },
  {
    id: 'eng',
    name: 'Engineering',
    description: 'Design and development of systems, structures, and machines',
    requiredGPA: 3.0,
    requiredSubjects: ['Mathematics', 'Physics'],
    relatedCareers: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer'],
    rebPathway: 'mathematics_science_1',
    difficulty: 'Hard',
    duration: 4,
    averageSalary: { entry: 680000, mid: 850000, senior: 1150000 },
    rwandanUniversities: ['University of Rwanda', 'INES-Ruhengeri']
  },
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Pure and applied mathematics, statistics, and mathematical modeling',
    requiredGPA: 3.0,
    requiredSubjects: ['Mathematics', 'Physics'],
    relatedCareers: ['Mathematician', 'Statistician', 'Actuary', 'Data Analyst'],
    rebPathway: 'mathematics_science_1',
    difficulty: 'Hard',
    duration: 4,
    averageSalary: { entry: 600000, mid: 800000, senior: 1100000 },
    rwandanUniversities: ['University of Rwanda', 'AUCA']
  },

  // Mathematics & Science Stream 2
  {
    id: 'med',
    name: 'Medicine',
    description: 'Medical practice, patient care, and health sciences',
    requiredGPA: 3.7,
    requiredSubjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
    relatedCareers: ['Medical Doctor', 'Surgeon', 'Specialist', 'Researcher'],
    rebPathway: 'mathematics_science_2',
    difficulty: 'Very Hard',
    duration: 6,
    averageSalary: { entry: 800000, mid: 1200000, senior: 2000000 },
    rwandanUniversities: ['University of Rwanda']
  },
  {
    id: 'bio',
    name: 'Biology',
    description: 'Study of living organisms and biological processes',
    requiredGPA: 3.0,
    requiredSubjects: ['Biology', 'Chemistry', 'Mathematics'],
    relatedCareers: ['Biologist', 'Research Scientist', 'Lab Technician', 'Biotechnologist'],
    rebPathway: 'mathematics_science_2',
    difficulty: 'Hard',
    duration: 4,
    averageSalary: { entry: 500000, mid: 700000, senior: 950000 },
    rwandanUniversities: ['University of Rwanda', 'AUCA']
  },
  {
    id: 'agri',
    name: 'Agriculture',
    description: 'Crop production, animal husbandry, and agricultural technology',
    requiredGPA: 2.8,
    requiredSubjects: ['Biology', 'Chemistry'],
    relatedCareers: ['Agricultural Engineer', 'Agronomist', 'Veterinarian', 'Food Scientist'],
    rebPathway: 'mathematics_science_2',
    difficulty: 'Moderate',
    duration: 4,
    averageSalary: { entry: 450000, mid: 650000, senior: 850000 },
    rwandanUniversities: ['University of Rwanda']
  },

  // Arts & Humanities
  {
    id: 'law',
    name: 'Law',
    description: 'Legal studies, jurisprudence, and legal practice',
    requiredGPA: 3.2,
    requiredSubjects: ['History', 'Literature', 'Economics'],
    relatedCareers: ['Lawyer', 'Judge', 'Legal Advisor', 'Human Rights Advocate'],
    rebPathway: 'arts_humanities',
    difficulty: 'Hard',
    duration: 4,
    averageSalary: { entry: 550000, mid: 850000, senior: 1500000 },
    rwandanUniversities: ['University of Rwanda', 'Mount Kenya University']
  },
  {
    id: 'econ',
    name: 'Economics',
    description: 'Economic theory, policy analysis, and financial systems',
    requiredGPA: 2.8,
    requiredSubjects: ['Mathematics', 'Economics', 'History'],
    relatedCareers: ['Economist', 'Financial Analyst', 'Policy Advisor', 'Banker'],
    rebPathway: 'arts_humanities',
    difficulty: 'Moderate',
    duration: 4,
    averageSalary: { entry: 500000, mid: 750000, senior: 1100000 },
    rwandanUniversities: ['University of Rwanda', 'AUCA']
  },
  {
    id: 'psych',
    name: 'Psychology',
    description: 'Human behavior, mental processes, and therapeutic techniques',
    requiredGPA: 2.7,
    requiredSubjects: ['Literature', 'Biology'],
    relatedCareers: ['Psychologist', 'Counselor', 'Social Worker', 'HR Specialist'],
    rebPathway: 'arts_humanities',
    difficulty: 'Moderate',
    duration: 4,
    averageSalary: { entry: 450000, mid: 650000, senior: 850000 },
    rwandanUniversities: ['University of Rwanda', 'AUCA']
  },

  // Languages
  {
    id: 'lang',
    name: 'Languages & Literature',
    description: 'Language studies, literature, and linguistic analysis',
    requiredGPA: 2.5,
    requiredSubjects: ['Literature', 'Languages'],
    relatedCareers: ['Translator', 'Interpreter', 'Language Teacher', 'Diplomat'],
    rebPathway: 'languages',
    difficulty: 'Moderate',
    duration: 4,
    averageSalary: { entry: 400000, mid: 600000, senior: 800000 },
    rwandanUniversities: ['University of Rwanda', 'AUCA']
  },
  {
    id: 'comm',
    name: 'Communication Studies',
    description: 'Media, journalism, public relations, and communication theory',
    requiredGPA: 2.6,
    requiredSubjects: ['Literature', 'Languages'],
    relatedCareers: ['Journalist', 'PR Specialist', 'Media Producer', 'Communications Manager'],
    rebPathway: 'languages',
    difficulty: 'Moderate',
    duration: 4,
    averageSalary: { entry: 420000, mid: 620000, senior: 850000 },
    rwandanUniversities: ['University of Rwanda', 'AUCA']
  }
];

// Grade to GPA conversion
export const gradeToGPA: { [key: string]: number } = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0
};

// REB Pathway Mapping
export const rebPathwayNames = {
  mathematics_science_1: 'Mathematics & Science Stream 1',
  mathematics_science_2: 'Mathematics & Science Stream 2', 
  arts_humanities: 'Arts & Humanities',
  languages: 'Languages'
};

// Sample complete transcript
export const sampleTranscript = {
  id: 'sample_1',
  subjects: commonSubjects,
  gpa: 3.4,
  totalCredits: 28,
  institution: 'Sample High School',
  studentId: 'student_123',
  createdAt: new Date(),
  rebPathway: 'mathematics_science_1' as const
};
