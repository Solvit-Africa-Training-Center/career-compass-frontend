import React from 'react';
import { useLocation, Link } from 'react-router-dom';
// import { STUDENT_SIDEBAR_LINKS } from './constants/Navigations';
import { 
    STUDENT_SIDEBAR_LINKS,
    ADMIN_SIDEBAR_LINKS,
    INSTITUTE_SIDEBAR_LINKS,
    STAFF_SIDEBAR_LINKS,
    RECRUITER_SIDEBAR_LINKS,
    SIDEBAR_BOTTOM_LINKS
} from './constants/Navigations';

import { SidebarLink, UserRole } from '@/types/index';

interface SidebarProps {
  userRole?: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole = 'student' }) => {
    const location = useLocation();

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
            case 'recruiter':
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
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-blue-600">CAREER</h1>
                        <h2 className="text-lg font-semibold text-blue-600">COMPASS</h2>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6">
                <nav className="space-y-2 px-4">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.key}
                            to={link.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                isActive(link.path)
                                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className="flex-shrink-0">
                                {link.icon}
                            </span>
                            <span className="font-medium">
                                {link.label}
                            </span>
                            {isActive(link.path) && (
                                <div className="ml-auto">
                                    <svg 
                                        className="w-4 h-4 text-blue-600" 
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
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bottom Links */}
            <div className="border-t border-gray-200 p-4">
                <nav className="space-y-2">
                    {SIDEBAR_BOTTOM_LINKS.map((link) => (
                        <Link
                            key={link.key}
                            to={link.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                link.key === 'logout' 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            <span className="flex-shrink-0">
                                {link.icon}
                            </span>
                            <span className="font-medium">
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;