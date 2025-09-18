import type { ReactNode } from 'react';

export interface SidebarLink {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export type UserRole = 'student' | 'admin' | 'institution' | 'staff' | 'agent';

export interface User {
  id?: number; // Updated to match response
  name?: string;
  email: string;
  role: { id: number; code: string; name: string }[];
  accessToken: string; // For tokens.access
  refreshToken?: string; // Optional refresh token
  avatar?: string;
}
export interface Profile {
  id: number;
  user: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: 'M' | 'F';
  country: string;
  city: string;
  phone_number: string;
  avatar: string;
  created_at: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  birth_date: string;
  language: string;
  gender: 'M' | 'F';
  country: string;
  city: string;
  avatar?: File;
}

export interface Country {
  code: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  country_code: string;
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
export * from "./career";
