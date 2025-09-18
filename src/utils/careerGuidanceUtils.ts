import type {
  Transcript,
  PersonalityProfile,
  CareerRecommendation,
  Major,
  REBPathway,
  Subject
} from '../types/career';
import { majorsDatabase, gradeToGPA, rebPathwayNames } from '../data/careerGuidanceData';

/**
 * Calculate GPA from subjects
 */
export const calculateGPA = (subjects: Subject[]): number => {
  if (subjects.length === 0) return 0;
  
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  subjects.forEach(subject => {
    const gradePoint = gradeToGPA[subject.grade] || 0;
    totalGradePoints += gradePoint * subject.creditHours;
    totalCredits += subject.creditHours;
  });
  
  return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
};

/**
 * Calculate academic match score based on transcript
 */
export const calculateAcademicMatch = (transcript: Transcript, major: Major): number => {
  let score = 0;
  const maxScore = 100;
  
  // GPA match (40% of score)
  const gpaScore = Math.min((transcript.gpa / major.requiredGPA) * 40, 40);
  score += gpaScore;
  
  // Required subjects match (40% of score)
  const transcriptSubjects = transcript.subjects.map(s => s.name.toLowerCase());
  const requiredSubjects = major.requiredSubjects.map(s => s.toLowerCase());
  
  let subjectMatches = 0;
  requiredSubjects.forEach(reqSubject => {
    if (transcriptSubjects.some(transSubject => 
      transSubject.includes(reqSubject) || reqSubject.includes(transSubject)
    )) {
      subjectMatches++;
    }
  });
  
  const subjectScore = (subjectMatches / requiredSubjects.length) * 40;
  score += subjectScore;
  
  // Credit hours completeness (20% of score)
  const creditScore = Math.min((transcript.totalCredits / 30) * 20, 20);
  score += creditScore;
  
  return Math.min(Math.round(score), maxScore);
};

/**
 * Calculate REB pathway alignment from transcript subjects
 */
export const calculateREBPathway = (subjects: Subject[]): REBPathway => {
  const subjectNames = subjects.map(s => s.name.toLowerCase());
  
  const mathSciCount = subjectNames.filter(name => 
    ['mathematics', 'physics', 'computer'].some(keyword => name.includes(keyword))
  ).length;
  
  const bioSciCount = subjectNames.filter(name => 
    ['biology', 'chemistry', 'agriculture'].some(keyword => name.includes(keyword))
  ).length;
  
  const humanitiesCount = subjectNames.filter(name => 
    ['history', 'literature', 'economics', 'geography'].some(keyword => name.includes(keyword))
  ).length;
  
  const languageCount = subjectNames.filter(name => 
    ['english', 'french', 'kinyarwanda', 'language'].some(keyword => name.includes(keyword))
  ).length;
  
  if (mathSciCount >= bioSciCount && mathSciCount >= humanitiesCount && mathSciCount >= languageCount) {
    return 'mathematics_science_1';
  }
  if (bioSciCount >= humanitiesCount && bioSciCount >= languageCount) {
    return 'mathematics_science_2';
  }
  if (languageCount >= humanitiesCount) {
    return 'languages';
  }
  return 'arts_humanities';
};

/**
 * Calculate personality match score based on REB pathway alignment
 */
export const calculatePersonalityMatch = (
  personalityProfile: PersonalityProfile,
  major: Major
): number => {
  const pathwayScore = personalityProfile.scores[major.rebPathway] || 0;
  return Math.round(pathwayScore);
};

/**
 * Generate career recommendations based on REB pathways
 */
export const generateRecommendations = (
  transcript: Transcript,
  personalityProfile: PersonalityProfile
): CareerRecommendation[] => {
  const recommendations: CareerRecommendation[] = [];
  const transcriptPathway = calculateREBPathway(transcript.subjects);
  
  majorsDatabase.forEach(major => {
    const academicMatch = calculateAcademicMatch(transcript, major);
    const personalityMatch = calculatePersonalityMatch(personalityProfile, major);
    const pathwayAlignment = major.rebPathway === transcriptPathway ? 100 : 
      getPathwayCompatibility(transcriptPathway, major.rebPathway);
    
    // Overall match: 40% academic, 30% personality, 30% pathway alignment
    const overallMatch = Math.round(
      (academicMatch * 0.4) + (personalityMatch * 0.3) + (pathwayAlignment * 0.3)
    );
    
    const explanation = generateExplanation(major, academicMatch, personalityMatch, transcript, pathwayAlignment);
    const strengths = generateStrengths(major, academicMatch, personalityMatch, pathwayAlignment);
    const considerations = generateConsiderations(major, academicMatch, personalityMatch, pathwayAlignment);
    const nextSteps = generateNextSteps(major, transcript);
    
    recommendations.push({
      id: `rec_${major.id}`,
      major,
      matchPercentage: overallMatch,
      academicMatch,
      personalityMatch,
      pathwayAlignment,
      explanation,
      strengths,
      considerations,
      nextSteps
    });
  });
  
  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

/**
 * Calculate compatibility between REB pathways
 */
const getPathwayCompatibility = (from: REBPathway, to: REBPathway): number => {
  const compatibility: Record<REBPathway, Record<REBPathway, number>> = {
    mathematics_science_1: {
      mathematics_science_1: 100,
      mathematics_science_2: 70,
      arts_humanities: 40,
      languages: 30
    },
    mathematics_science_2: {
      mathematics_science_1: 70,
      mathematics_science_2: 100,
      arts_humanities: 50,
      languages: 30
    },
    arts_humanities: {
      mathematics_science_1: 40,
      mathematics_science_2: 50,
      arts_humanities: 100,
      languages: 80
    },
    languages: {
      mathematics_science_1: 30,
      mathematics_science_2: 30,
      arts_humanities: 80,
      languages: 100
    }
  };
  
  return compatibility[from][to];
};

/**
 * Generate explanation for recommendation
 */
const generateExplanation = (
  major: Major,
  academicMatch: number,
  personalityMatch: number,
  transcript: Transcript,
  pathwayAlignment: number
): string => {
  const gpaStatus = transcript.gpa >= major.requiredGPA ? 'meets' : 'falls below';
  const personalityFit = personalityMatch >= 70 ? 'excellent' : personalityMatch >= 50 ? 'good' : 'moderate';
  const pathwayFit = pathwayAlignment >= 80 ? 'strongly aligns' : pathwayAlignment >= 60 ? 'aligns well' : 'partially aligns';
  
  return `${major.name} is recommended for the ${rebPathwayNames[major.rebPathway]} pathway. Your academic background ${pathwayFit} with this field, your GPA of ${transcript.gpa} ${gpaStatus} the required ${major.requiredGPA}, and your interests show ${personalityFit} alignment. Career opportunities include ${major.relatedCareers.slice(0, 2).join(', ')}.`;
};

/**
 * Generate strengths for recommendation
 */
const generateStrengths = (major: Major, academicMatch: number, personalityMatch: number, pathwayAlignment: number): string[] => {
  const strengths: string[] = [];
  
  if (pathwayAlignment >= 80) {
    strengths.push(`Perfect fit for ${rebPathwayNames[major.rebPathway]} pathway`);
  }
  
  if (academicMatch >= 70) {
    strengths.push('Strong academic foundation for this field');
  }
  
  if (personalityMatch >= 70) {
    strengths.push('Your interests align well with this field');
  }
  
  if (major.rwandanUniversities.length > 0) {
    strengths.push(`Available at ${major.rwandanUniversities.length} Rwandan universities`);
  }
  
  if (major.averageSalary.entry > 60000) {
    strengths.push('High earning potential in related careers');
  }
  
  return strengths;
};

/**
 * Generate considerations for recommendation  
 */
const generateConsiderations = (major: Major, academicMatch: number, personalityMatch: number, pathwayAlignment: number): string[] => {
  const considerations: string[] = [];
  
  if (pathwayAlignment < 60) {
    considerations.push('This field is outside your primary REB pathway - consider if it matches your interests');
  }
  
  if (academicMatch < 60) {
    considerations.push('May need to strengthen academic foundation in required subjects');
  }
  
  if (personalityMatch < 50) {
    considerations.push('Consider if this field aligns with your interests and working style');
  }
  
  if (major.difficulty === 'Hard' || major.difficulty === 'Very Hard') {
    considerations.push('This is a challenging field requiring significant dedication');
  }
  
  if (major.duration > 4) {
    considerations.push(`Requires ${major.duration} years of study`);
  }
  
  return considerations;
};

/**
 * Generate next steps for recommendation
 */
const generateNextSteps = (major: Major, transcript: Transcript): string[] => {
  const nextSteps: string[] = [];
  
  // Check for missing required subjects
  const transcriptSubjects = transcript.subjects.map(s => s.name.toLowerCase());
  const missingSubjects = major.requiredSubjects.filter(reqSubject =>
    !transcriptSubjects.some(transSubject =>
      transSubject.includes(reqSubject.toLowerCase()) || 
      reqSubject.toLowerCase().includes(transSubject)
    )
  );
  
  if (missingSubjects.length > 0) {
    nextSteps.push(`Consider taking: ${missingSubjects.join(', ')}`);
  }
  
  if (transcript.gpa < major.requiredGPA) {
    nextSteps.push(`Work on improving GPA to meet the ${major.requiredGPA} requirement`);
  }
  
  nextSteps.push(`Research ${major.name} programs at universities you're interested in`);
  nextSteps.push(`Connect with professionals in ${major.relatedCareers[0]} field`);
  nextSteps.push('Consider job shadowing or internships in related fields');
  
  return nextSteps;
};

/**
 * Validate transcript data
 */
export const validateTranscript = (subjects: Subject[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (subjects.length === 0) {
    errors.push('At least one subject is required');
  }
  
  subjects.forEach((subject, index) => {
    if (!subject.name.trim()) {
      errors.push(`Subject ${index + 1}: Name is required`);
    }
    
    if (!subject.grade || !gradeToGPA.hasOwnProperty(subject.grade)) {
      errors.push(`Subject ${index + 1}: Valid grade is required`);
    }
    
    if (!subject.creditHours || subject.creditHours < 1 || subject.creditHours > 6) {
      errors.push(`Subject ${index + 1}: Credit hours must be between 1 and 6`);
    }
    
    if (!subject.semester.trim()) {
      errors.push(`Subject ${index + 1}: Semester is required`);
    }
    
    if (!subject.year || subject.year < 2020 || subject.year > new Date().getFullYear()) {
      errors.push(`Subject ${index + 1}: Valid year is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format salary for display
 */
export const formatSalary = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get match color based on percentage
 */
export const getMatchColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600 bg-green-50';
  if (percentage >= 60) return 'text-primarycolor-600 bg-primarycolor-50';
  if (percentage >= 40) return 'text-secondarycolor-600 bg-secondarycolor-50';
  return 'text-red-600 bg-red-50';
};

/**
 * Get difficulty color
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy': return 'text-green-600 bg-green-50';
    case 'Moderate': return 'text-primarycolor-600 bg-primarycolor-50'; 
    case 'Hard': return 'text-orange-600 bg-orange-50';
    case 'Very Hard': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};
