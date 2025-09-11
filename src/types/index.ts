import { ReactNode } from 'react';

export interface SidebarLink {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export type UserRole = 'student' | 'admin' | 'institution' | 'staff' | 'agent';

export interface User {
  id?: string;
  name?: string;
  email: string;
  role: string;
  token: string;
  avatar?: string;
}
// Analytics
export interface StatCardData {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: 'applications' | 'eligibility' | 'deadlines' | 'programs';
  color: 'yellow' | 'green' | 'red' | 'blue';
}

export interface DeadlineItem {
  id: string;
  title: string;
  subtitle: string;
  daysLeft: number;
  priority: 'urgent' | 'important' | 'normal';
}

export interface AnalyticsProps {
  stats?: StatCardData[];
  deadlines?: DeadlineItem[];
  showDeadlines?: boolean;
  className?: string;
}