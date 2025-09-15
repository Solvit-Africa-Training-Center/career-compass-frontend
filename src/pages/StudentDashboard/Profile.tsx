import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProfileFormData } from '@/types/';
import ProfileSidebar from '@/components/ProfileSidebar';
import PersonalInformationForm from '@/components/PersonalInformationForm';
import ResetPassword from '@/components/ResetPassword';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();
  const { authUser, fetchProfile, updateProfile, createProfile, profile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: authUser?.email || '',
    age: 0,
    birth_date: '',
    language: '',
    gender: 'M',
    country: '',
    city: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser) return;
      
      try {
        const existingProfile = await fetchProfile();
        if (existingProfile) {
          setProfileData({
            first_name: existingProfile.first_name || '',
            last_name: existingProfile.last_name || '',
            email: authUser.email,
            age: 0, // Calculate from birth_date if needed
            birth_date: existingProfile.birth_date || '',
            language: existingProfile.language || '',
            gender: existingProfile.gender || 'M',
            country: existingProfile.country || '',
            city: existingProfile.city || ''
          });
        }
      } catch (err) {
        toast.error('Failed to load profile data');
      }
    };
    loadProfile();
  }, [authUser, fetchProfile]);

  const handleSave = async (data: ProfileFormData) => {
    try {
      const profileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        gender: data.gender,
        country: data.country,
        city: data.city,
        // Handle avatar upload separately if needed
      };
      
      if (profile) {
        // Update existing profile
        await updateProfile(profileData);
        toast.success('Profile updated successfully');
      } else {
        // Create new profile
        await createProfile(data);
        toast.success('Profile created successfully');
      }
    } catch (err) {
      const action = profile ? 'update' : 'create';
      toast.error(`Failed to ${action} profile`);
      console.error('Profile error:', err);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInformationForm
            initialData={profileData}
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