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