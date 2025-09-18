import React, { useState, useRef, useEffect } from 'react';
import type{ ProfileFormData } from '@/types/';

interface PersonalInformationFormProps {
  initialData?: Partial<ProfileFormData>;
  onSave: (data: ProfileFormData) => void;
  onBack: () => void;
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({
  initialData,
  onSave,
  onBack
}) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    age: initialData?.age || 0,
    birth_date: initialData?.birth_date || '',
    phone_number: initialData?.phone_number || '',
    gender: initialData?.gender || 'M',
    country: initialData?.country || '',
    city: initialData?.city || ''
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        age: initialData.age || 0,
        birth_date: initialData.birth_date || '',
        phone_number: initialData.phone_number || '',
        gender: initialData.gender || 'M',
        country: initialData.country || '',
        city: initialData.city || ''
      });
    }
  }, [initialData]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const countries = [
    { code: 'RW', name: 'Rwanda' },
    { code: 'KE', name: 'Kenya' },
    { code: 'UG', name: 'Uganda' },
    { code: 'TZ', name: 'Tanzania' }
  ];

  const cities = [
    { id: 'kigali', name: 'Kigali' },
    { id: 'butare', name: 'Butare' },
    { id: 'gisenyi', name: 'Gisenyi' },
    { id: 'ruhengeri', name: 'Ruhengeri' }
  ];



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleGenderChange = (gender: 'M' | 'F') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primarycolor-600 mb-6">PROFILE INFORMATION</h1>
          
          <div className="flex justify-end mb-6">
            <button className="text-primarycolor-600 underline hover:text-primarycolor-800 transition-colors">
              Change password
            </button>
          </div>

          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src="/api/placeholder/128/128" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleAvatarUpload}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primarycolor-600 rounded-full flex items-center justify-center text-white hover:bg-primarycolor-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                type="button"
                className="absolute bottom-0 right-8 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email and Age Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent"
                placeholder="Enter age"
              />
            </div>
          </div>

          {/* Date of Birth and Phone Number Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Gender Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose gender
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'M'}
                  onChange={() => handleGenderChange('M')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  formData.gender === 'M' ? 'border-primarycolor-600 bg-primarycolor-600' : 'border-gray-300'
                }`}>
                  {formData.gender === 'M' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-700">Male</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'F'}
                  onChange={() => handleGenderChange('F')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  formData.gender === 'F' ? 'border-primarycolor-600 bg-primarycolor-600' : 'border-gray-300'
                }`}>
                  {formData.gender === 'F' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-700">Female</span>
              </label>
            </div>
          </div>

          {/* Country and City Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-6">
            <button
              type="submit"
              className="w-full bg-primarycolor-600 text-white py-4 rounded-lg font-medium hover:bg-primarycolor-700 transition-colors"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full border-2 border-primarycolor-600 text-primarycolor-600 py-4 rounded-lg font-medium hover:bg-primarycolor-50 transition-colors"
            >
              BACK TO DASHBOARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformationForm;