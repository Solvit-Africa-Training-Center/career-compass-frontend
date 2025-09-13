import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type{ ProfileFormData } from '@/types/';
import ProfileSidebar from '@/components/ProfileSidebar';
import PersonalInformationForm from '@/components/PersonalInformationForm';
import ResetPassword from '@/components/ResetPassword';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  // Mock data - replace with actual data from your API/state management
  const initialProfileData: Partial<ProfileFormData> = {
    first_name: 'Bryan',
    last_name: 'Mike',
    email: 'bryan@example.com',
    age: 19,
    birth_date: '21/04/2007',
    language: 'Kinyarwanda',
    gender: 'M',
    country: '',
    city: ''
  };

  const handleSave = (data: ProfileFormData) => {
    console.log('Saving profile data:', data);
    // TODO: Implement API call to save profile data
    // Example: await updateProfile(data);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInformationForm
            initialData={initialProfileData}
            onSave={handleSave}
            onBack={handleBackToDashboard}
          />
        );
      case 'password':
        return (
          <div className="flex-1 bg-white p-8">
            <div className="max-w-4xl mx-auto">
              <ResetPassword />
            </div>
          </div>
        );
      case 'academic':
        return (
          <div className="flex-1 bg-white p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-primarycolor-600 mb-6">Academic Information</h2>
              <p className="text-gray-600">Academic information form will be implemented here.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProfileSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {renderContent()}
    </div>
  );
};

export default Profile;