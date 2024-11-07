'use client'

import { createContext,  useState, useEffect, ReactNode, useContext } from 'react';
import { User } from '../types/user';

import { useRouter } from 'next/navigation';

interface AuthContextType{
    user: User | null;
    loading: boolean;
    login: (email: string, password: string ) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
   

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() =>{
        checkAuth();

    }, []);

    const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include', // Important for cookies
          });
    
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setLoading(false);
        }
      };


      const login = async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for cookies
            body: JSON.stringify({ email, password }),
          });
    
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }
    
          const data = await response.json();
          setUser(data.user);
          router.refresh(); // Refresh the current route
        } catch (error) {
          throw error;
        }
      };
    
      const signup = async (name: string, email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, email, password }),
          });
    
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
          }
    
          // After successful signup, log the user in
          await login(email, password);
        } catch (error) {
          throw error;
        }
      };

      return (
        <AuthContext.Provider value={{ user, loading, login, signup, }}>
          {children}
        </AuthContext.Provider>
      );
    
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };