import React from 'react';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'personal', label: 'Personal information' },
    { id: 'password', label: 'Change password' },
    { id: 'academic', label: 'Academic information' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen w-64 p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === item.id
                ? 'text-primarycolor-600 font-medium'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;