import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { authUser } = useAuth();
    const { isDark } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!authUser){
        return null
    }
    
    return (
        <div className={`flex h-screen bg-gray-50 ${isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-100'}`}>
            <Sidebar
                userRole={authUser.role}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onOpen={() => setSidebarOpen(true)}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;