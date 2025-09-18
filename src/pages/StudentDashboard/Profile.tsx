import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProfileFormData } from '@/types/';
import ProfileSidebar from '@/components/ProfileSidebar';
import ProfileCard from '@/components/ProfileCard';
import EditProfileModal from '@/components/EditProfileModal';
import ResetPassword from '@/components/ResetPassword';
import { useAuth } from '@/hooks/useAuth';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, fetchProfile, updateProfile, createProfile, profile, loading } = useAuth();
  const [profileData, setProfileData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: authUser?.email || '',
    age: 0,
    birth_date: '',
    phone_number: '',
    gender: 'M',
    country: '',
    city: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser) return;
      
      if (!profile) {
        try {
          await fetchProfile();
        } catch (err) {
          console.error('Failed to load profile data:', err);
        }
      }
    };
    loadProfile();
  }, [authUser]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: authUser?.email || '',
        age: 0, // Calculate from birth_date if needed
        birth_date: profile.birth_date || '',
        phone_number: profile.phone_number || '',
        gender: profile.gender || 'M',
        country: profile.country || '',
        city: profile.city || ''
      });
    } else if (authUser) {
      setProfileData(prev => ({
        ...prev,
        email: authUser.email
      }));
    }
  }, [profile, authUser]);

  const handleSave = async (data: ProfileFormData) => {
    const profileData = {
      first_name: data.first_name,
      last_name: data.last_name,
      birth_date: data.birth_date,
      gender: data.gender,
      country: data.country,
      city: data.city,
      phone_number: data.phone_number,
    };
    
    if (profile) {
      await updateProfile(profileData);
    } else {
      await createProfile(data);
    }
    setIsEditModalOpen(false);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <ProfileCard 
                profile={profile}
                email={authUser?.email || ''}
                onEdit={() => setIsEditModalOpen(true)}
              />
              <div className="mt-6">
                <button
                  onClick={handleBackToDashboard}
                  className="w-full border-2 border-primarycolor-600 text-primarycolor-600 py-3 rounded-lg font-medium hover:bg-primarycolor-50 transition-colors"
                >
                  BACK TO DASHBOARD
                </button>
              </div>
            </div>
          </div>
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
      
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        initialData={profileData}
        loading={loading}
      />
    </div>
  );
};

export default Profile;