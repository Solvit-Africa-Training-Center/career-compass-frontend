import { 
    HelpCircle, 
    LayoutDashboard, 
    LogOut,
    Settings, 
    Sparkle,
    Users,
    Building2,
    UserCheck,
    FileText,
    BarChart3,
    UserPlus,
    GraduationCap,
    BookOpen,
    Calendar,
    MessageSquare
} from "lucide-react";
import { SidebarLink } from '@/types/index';

export const STUDENT_SIDEBAR_LINKS: SidebarLink[] = [
    {
        key:'dashboard',
        label:'Dashboard',
        path:'/dashboard',
        icon:<LayoutDashboard size={20} strokeWidth={2.5}/>
    },
    {
        key:'programs',
        label:'Programs',
        path:'/programs',
        icon:<GraduationCap size={20} strokeWidth={2.5} />
    },
    {
        key:'applications',
        label:'Applications',
        path:'/applications',
        icon:<FileText size={20} strokeWidth={2.5} />
    },
    {
        key:'guidance',
        label:'AI Guidance',
        path:'/guidance',
        icon:<Sparkle size={20} strokeWidth={2.5}/>
    },
];

export const ADMIN_SIDEBAR_LINKS: SidebarLink[] = [
    {
        key:'dashboard',
        label:'Dashboard',
        path:'/admin/dashboard',
        icon:<LayoutDashboard size={20} strokeWidth={2.5}/>
    },
    {
        key:'users',
        label:'User Management',
        path:'/admin/users',
        icon:<Users size={20} strokeWidth={2.5}/>
    },
    {
        key:'institutions',
        label:'Institutions',
        path:'/admin/institutions',
        icon:<Building2 size={20} strokeWidth={2.5}/>
    },
    {
        key:'programs',
        label:'Programs',
        path:'/admin/programs',
        icon:<BookOpen size={20} strokeWidth={2.5}/>
    },
    {
        key:'analytics',
        label:'Analytics',
        path:'/admin/analytics',
        icon:<BarChart3 size={20} strokeWidth={2.5}/>
    },
    {
        key:'settings',
        label:'Settings',
        path:'/admin/settings',
        icon:<Settings size={20} strokeWidth={2.5}/>
    }
];

export const INSTITUTE_SIDEBAR_LINKS: SidebarLink[] = [
    {
        key:'dashboard',
        label:'Dashboard',
        path:'/institute/dashboard',
        icon:<LayoutDashboard size={20} strokeWidth={2.5}/>
    },
    {
        key:'programs',
        label:'Programs',
        path:'/institute/programs',
        icon:<BookOpen size={20} strokeWidth={2.5}/>
    },
    {
        key:'applications',
        label:'Applications',
        path:'/institute/applications',
        icon:<FileText size={20} strokeWidth={2.5}/>
    },
    {
        key:'students',
        label:'Students',
        path:'/institute/students',
        icon:<Users size={20} strokeWidth={2.5}/>
    },
    {
        key:'staff',
        label:'Staff',
        path:'/institute/staff',
        icon:<UserCheck size={20} strokeWidth={2.5}/>
    },
    {
        key:'analytics',
        label:'Analytics',
        path:'/institute/analytics',
        icon:<BarChart3 size={20} strokeWidth={2.5}/>
    }
];

export const STAFF_SIDEBAR_LINKS: SidebarLink[] = [
    {
        key:'dashboard',
        label:'Dashboard',
        path:'/staff/dashboard',
        icon:<LayoutDashboard size={20} strokeWidth={2.5}/>
    },
    {
        key:'programs',
        label:'Programs',
        path:'/staff/programs',
        icon:<BookOpen size={20} strokeWidth={2.5}/>
    },
    {
        key:'applications',
        label:'Applications',
        path:'/staff/applications',
        icon:<FileText size={20} strokeWidth={2.5}/>
    },
    {
        key:'students',
        label:'Students',
        path:'/staff/students',
        icon:<Users size={20} strokeWidth={2.5}/>
    },
    {
        key:'schedule',
        label:'Schedule',
        path:'/staff/schedule',
        icon:<Calendar size={20} strokeWidth={2.5}/>
    }
];

export const RECRUITER_SIDEBAR_LINKS: SidebarLink[] = [
    {
        key:'dashboard',
        label:'Dashboard',
        path:'/recruiter/dashboard',
        icon:<LayoutDashboard size={20} strokeWidth={2.5}/>
    },
    {
        key:'candidates',
        label:'Candidates',
        path:'/recruiter/candidates',
        icon:<Users size={20} strokeWidth={2.5}/>
    },
    {
        key:'programs',
        label:'Programs',
        path:'/recruiter/programs',
        icon:<BookOpen size={20} strokeWidth={2.5}/>
    },
    {
        key:'outreach',
        label:'Outreach',
        path:'/recruiter/outreach',
        icon:<UserPlus size={20} strokeWidth={2.5}/>
    },
    {
        key:'messages',
        label:'Messages',
        path:'/recruiter/messages',
        icon:<MessageSquare size={20} strokeWidth={2.5}/>
    },
    {
        key:'analytics',
        label:'Analytics',
        path:'/recruiter/analytics',
        icon:<BarChart3 size={20} strokeWidth={2.5}/>
    }
];

export const SIDEBAR_BOTTOM_LINKS: SidebarLink[] = [
    {
        key: 'help',
        label: 'Help',
        path: '/help',
        icon: <HelpCircle size={20} strokeWidth={2.5} />
    },
    {
        key: 'logout',
        label: 'Logout',
        path: '/logout',
        icon: <LogOut size={20} strokeWidth={2.5} />
    }
];