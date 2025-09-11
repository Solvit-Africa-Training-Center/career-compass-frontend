import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { 
    STUDENT_SIDEBAR_LINKS,
    ADMIN_SIDEBAR_LINKS,
    INSTITUTE_SIDEBAR_LINKS,
    STAFF_SIDEBAR_LINKS,
    RECRUITER_SIDEBAR_LINKS,
    SIDEBAR_BOTTOM_LINKS
} from './constants/Navigations';

import { SidebarLink, UserRole } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface SidebarProps {
  userRole?: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole = 'student', isOpen = true, onClose }) => {
    const location = useLocation();
    const { isDark } = useTheme();

    // Function to get sidebar links based on user role
    const getSidebarLinks = (role: UserRole): SidebarLink[] => {
        switch (role.toLowerCase() as UserRole) {
            case 'student':
                return STUDENT_SIDEBAR_LINKS;
            case 'admin':
                return ADMIN_SIDEBAR_LINKS;
            case 'institution':
                return INSTITUTE_SIDEBAR_LINKS;
            case 'staff':
                return STAFF_SIDEBAR_LINKS;
            case 'agent':
                return RECRUITER_SIDEBAR_LINKS;
            default:
                return STUDENT_SIDEBAR_LINKS;
        }
    };

    const sidebarLinks = getSidebarLinks(userRole);
    
    // Function to check if current path matches the link
    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 z-50 ${isOpen ? 'w-64 sm:w-60 md:w-64' : 'lg:w-16'} h-screen ${isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transform transition-all duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                {/* Logo Section */}
                <div className={`h-16 px-4 lg:px-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                    {isOpen ? (
                        <img src="logo.png" className='w-[300px] h-[300px] sm:w-12 sm:h-12 lg:w-[140px] lg:h-[140px] rounded-full object-cover'/>
    
                        
                    ) : (
                        <div className="hidden lg:flex w-full justify-center">
                            <div className="w-8 h-8 bg-primarycolor-600 rounded-lg flex items-center justify-center">
                                <div className="space-y-1">
                                    <div className="w-4 h-0.5 bg-white"></div>
                                    <div className="w-4 h-0.5 bg-white"></div>
                                    <div className="w-4 h-0.5 bg-white"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={onClose}
                        className={`lg:hidden p-2 rounded-md ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

            {/* Navigation Links */}
            <div className="flex-1 py-4 lg:py-6">
                <nav className="space-y-1 lg:space-y-2 px-3 lg:px-4">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.key}
                            to={link.path}
                            className={`flex items-center ${isOpen ? 'space-x-2 lg:space-x-3 px-3 lg:px-4' : 'lg:justify-center lg:px-2'} py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                                isActive(link.path)
                                    ? isDark ? 'bg-primarycolor-800 text-primarycolor-400 border-r-2 border-primarycolor-400' : 'bg-primarycolor-50 text-primarycolor-600 border-r-1 border-primarycolor-600'
                                    : isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            title={!isOpen ? link.label : undefined}
                        >
                            <span className="flex-shrink-0">
                                {link.icon}
                            </span>
                            {isOpen && (
                                <>
                                    <span className="font-medium">
                                        {link.label}
                                    </span>
                                    {isActive(link.path) && (
                                        <div className="ml-auto">
                                            <svg 
                                                className="w-4 h-4 text-primarycolor-600" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M9 5l7 7-7 7" 
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bottom Links */}
            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-3 lg:p-4`}>
                <nav className="space-y-1 lg:space-y-2">
                    {SIDEBAR_BOTTOM_LINKS.map((link) => (
                        <Link
                            key={link.key}
                            to={link.path}
                            className={`flex items-center ${isOpen ? 'space-x-2 lg:space-x-3 px-3 lg:px-4' : 'lg:justify-center lg:px-2'} py-2 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base ${
                                link.key === 'logout' 
                                    ? isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'
                                    : isDark ? 'text-primarycolor-400 hover:bg-primarycolor-800' : 'text-primarycolor-600 hover:bg-primarycolor-50'
                            }`}
                            title={!isOpen ? link.label : undefined}
                        >
                            <span className="flex-shrink-0">
                                {link.icon}
                            </span>
                            {isOpen && (
                                <span className="font-medium">
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
            </div>
        </>
    );
};

export default Sidebar;