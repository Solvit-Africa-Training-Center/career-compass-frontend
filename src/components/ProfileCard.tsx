import { Edit, User, Mail, Phone, Calendar, MapPin, Globe } from 'lucide-react';
import type { Profile } from '@/types/';

interface ProfileCardProps {
  profile: Profile | null;
  email: string;
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, email, onEdit }) => {
  const getCountryName = (code: string) => {
    const countries = {
      'RW': 'Rwanda',
      'KE': 'Kenya', 
      'UG': 'Uganda',
      'TZ': 'Tanzania'
    };
    return countries[code as keyof typeof countries] || code;
  };

  const getCityName = (id: string) => {
    const cities = {
      'kigali': 'Kigali',
      'butare': 'Butare',
      'gisenyi': 'Gisenyi',
      'ruhengeri': 'Ruhengeri'
    };
    return cities[id as keyof typeof cities] || id;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-primarycolor-600">Profile Information</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-primarycolor-600 text-white rounded-md hover:bg-primarycolor-700 transition-colors"
        >
          <Edit size={16} />
          Edit
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mr-4">
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={32} className="text-gray-600" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {profile ? `${profile.first_name} ${profile.last_name}` : 'No name provided'}
          </h3>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
          <Mail size={20} className="text-primarycolor-600" />
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
          <Phone size={20} className="text-primarycolor-600" />
          <div>
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="font-medium">{profile?.phone_number || 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
          <Calendar size={20} className="text-primarycolor-600" />
          <div>
            <p className="text-sm text-gray-600">Birth Date</p>
            <p className="font-medium">{formatDate(profile?.birth_date || '')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
          <User size={20} className="text-primarycolor-600" />
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium">{profile?.gender === 'M' ? 'Male' : profile?.gender === 'F' ? 'Female' : 'Not specified'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
          <Globe size={20} className="text-primarycolor-600" />
          <div>
            <p className="text-sm text-gray-600">Country</p>
            <p className="font-medium">{profile?.country ? getCountryName(profile.country) : 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
          <MapPin size={20} className="text-primarycolor-600" />
          <div>
            <p className="text-sm text-gray-600">City</p>
            <p className="font-medium">{profile?.city ? getCityName(profile.city) : 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;