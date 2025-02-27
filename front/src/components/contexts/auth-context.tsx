import React, { ReactNode, createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Fixed import
import { Navigate } from 'react-router-dom';
import { Login, CheckAuth, fetchLocal } from '@/lib/apiCalls';
import { useLocal } from './local-context';

interface User {
  username: string;
  role: 'admin' | 'empleado';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthenticatedRouteProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { setLocal } = useLocal();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (token) {
          const { exp } = jwtDecode<{ exp: number }>(token);
          const currentTime = Date.now() / 1000; // Convert to seconds

          if (exp > currentTime) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await CheckAuth();
            if (!response) throw new Error('Auth Failed');
            
            setIsAuthenticated(true);
            setUser({ username: response.data.username, role: response.data.role });
          } else {
            logout();
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    // Periodically check the token validity every 5 minutes
    const intervalId = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await Login(username, password);
      if (!response) return false;

      const token = response.data.token;
      const { exp } = jwtDecode<{ exp: number }>(token);

      Cookies.set('auth_token', token);
      Cookies.set('auth_token_exp', exp.toString());

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUser({ username: response.data.username, role: response.data.role });

      const local_usuario = await fetchLocal(response.data.username);
      if (local_usuario && local_usuario !== 'todos') {
        setLocal(local_usuario);
      }

      return true;
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
    return false;
  };

  const logout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('auth_token_exp');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
