import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import type { Subject, Transcript, TranscriptFormProps } from '@/types/career';
import { calculateGPA, validateTranscript } from '@/utils/careerGuidanceUtils';
import { gradeToGPA } from '@/data/careerGuidanceData';

const TranscriptForm: React.FC<TranscriptFormProps> = ({ onSubmit, initialData }) => {
  const { isDark } = useTheme();
  const [subjects, setSubjects] = useState<Subject[]>(
    initialData?.subjects || [
      {
        id: '1',
        name: '',
        grade: '',
        creditHours: 1,
        semester: '',
        year: new Date().getFullYear()
      }
    ]
  );
  const [institution, setInstitution] = useState(initialData?.institution || '');
  const [studentId, setStudentId] = useState(initialData?.studentId || '');
  const [errors, setErrors] = useState<string[]>([]);

  const gradeOptions = Object.keys(gradeToGPA);
  const semesterOptions = ['Fall', 'Spring', 'Summer', 'Winter'];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const gpa = calculateGPA(subjects.filter(s => s.name && s.grade));
  const totalCredits = subjects.reduce((sum, s) => sum + (s.creditHours || 0), 0);

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      grade: '',
      creditHours: 1,
      semester: '',
      year: currentYear
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTranscript(subjects);
    
    if (!institution.trim()) {
      validation.errors.push('Institution name is required');
    }
    
    if (!studentId.trim()) {
      validation.errors.push('Student ID is required');
    }

    if (!validation.isValid || validation.errors.length > 0) {
      setErrors(validation.errors);
      return;
    }

    const transcript: Transcript = {
      id: Date.now().toString(),
      subjects: subjects.filter(s => s.name.trim()),
      gpa,
      totalCredits,
      institution: institution.trim(),
      studentId: studentId.trim(),
      createdAt: new Date()
    };

    setErrors([]);
    onSubmit(transcript);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Academic Transcript
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Enter your academic subjects, grades, and credit hours.
        </p>
      </div>

      {/* Institution and Student Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Institution Name
          </label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="e.g., Springfield High School"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent text-sm ${
              isDark 
                ? 'bg-primarycolor-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Student ID
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g., STU123456"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent text-sm ${
              isDark 
                ? 'bg-primarycolor-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Current GPA Display */}
      <div className={`p-4 rounded-lg border mb-6 ${
        isDark ? 'bg-primarycolor-700 border-gray-600' : 'bg-secondarycolor-50 border-secondarycolor-200'
      }`}>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {gpa.toFixed(2)}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Current GPA
            </div>
          </div>
          <div>
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalCredits}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Credits
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Academic Subjects
            </h3>
            <button
              type="button"
              onClick={addSubject}
              className="inline-flex items-center px-3 py-1.5 bg-primarycolor-500 hover:bg-primarycolor-600 text-white text-sm font-medium rounded-md transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Subject
            </button>
          </div>

          {subjects.map((subject, index) => (
            <div key={subject.id} className={`p-3 border rounded-lg ${
              isDark ? 'bg-primarycolor-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="md:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    placeholder="e.g., Mathematics"
                    className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-primarycolor-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-primarycolor-600 border-gray-500 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Grade
                  </label>
                  <select
                    value={subject.grade}
                    onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                    className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-primarycolor-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-primarycolor-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={subject.creditHours}
                    onChange={(e) => updateSubject(subject.id, 'creditHours', parseInt(e.target.value) || 1)}
                    className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-primarycolor-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-primarycolor-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Semester
                  </label>
                  <select
                    value={subject.semester}
                    onChange={(e) => updateSubject(subject.id, 'semester', e.target.value)}
                    className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-primarycolor-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-primarycolor-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select</option>
                    {semesterOptions.map(semester => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="flex-1">
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Year
                    </label>
                    <select
                      value={subject.year}
                      onChange={(e) => updateSubject(subject.id, 'year', parseInt(e.target.value))}
                      className={`w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-primarycolor-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-primarycolor-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  {subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(subject.id)}
                      className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className={`p-3 rounded-lg border mb-4 ${
            isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              <AlertCircle className={`w-4 h-4 mt-0.5 mr-2 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`} />
              <div>
                <h4 className={`font-medium text-sm ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                  Please correct the following errors:
                </h4>
                <ul className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                  {errors.map((error, index) => (
                    <li key={index} className="list-disc list-inside">{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-medium rounded-lg transition-colors"
          >
            Continue to Personality Assessment
          </button>
        </div>
      </form>
    </div>
  );
};

export default TranscriptForm;
