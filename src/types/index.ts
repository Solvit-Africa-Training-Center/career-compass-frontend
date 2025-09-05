export interface User {
  id?: number;
  email: string;
  password?: string;   // optional after login
  token?: string;      // JWT
  role?: string;       // student, agent, admin...
}