
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  avatar?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'employee') => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'admin' | 'employee') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
