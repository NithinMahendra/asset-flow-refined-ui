
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  avatar?: string;
  createdAt: Date;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'employee';
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: any;
  login: (email: string, password: string, role: 'admin' | 'employee') => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'admin' | 'employee') => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
