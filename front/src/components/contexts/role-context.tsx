import { useAuth } from '@/components/contexts/auth-context'
import { useEffect, createContext, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashRegister } from './CashRegister-Context';

interface RedirectEmployeesProps {
  children: React.ReactNode;
}

interface checkIfCashRegisterOpenProps {
  children: React.ReactNode;
}


interface NotificationContextType {
  message: string;
  setMessage: (msg: string) => void;
}


export const RedirectEmployees: React.FC<RedirectEmployeesProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'empleado') {
      navigate('/caja', { replace: true });
    }
  }, [user, navigate, 'empleado']);

  // Render nothing if the user is an employee
  if (user && user.role === 'empleado') {
    return null;
  }

  return <>{children}</>;
};

export const CheckIfCashRegisterOpen: React.FC<checkIfCashRegisterOpenProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen } = useCashRegister();
  const { setMessage } = useNotification();

  useEffect(() => {
    if (user && user.role === 'empleado' && !isOpen) {
      setMessage('La caja esta cerrada!');
      navigate('/caja', { replace: true })
    }
  }, [user, isOpen, navigate, setMessage]);

  if (user && user.role === 'empleado' && !isOpen){
    return null
  }

  return <>{children}</>
};  

// Create a context with default values
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string>('');

  return (
    <NotificationContext.Provider value={{ message, setMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for accessing the notification context
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};