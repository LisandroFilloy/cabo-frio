import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from '@/components/contexts/auth-context';
import Cookies from 'js-cookie';
import { useLocal } from './local-context';
import { getStatusCaja, updateStatusCaja } from '@/lib/apiCalls';

interface CashRegisterContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  loading: boolean;
}

const CashRegisterContext = createContext<CashRegisterContextType | undefined>(undefined);

interface CashRegisterProviderProps {
  children: ReactNode;
}

export const CashRegisterProvider: React.FC<CashRegisterProviderProps> = ({ children }) => {
  const {user} = useAuth();
  const username = user ? user.username : ''
  const {local} = useLocal();
  const [isOpen, setIsOpenState] = useState<boolean>(() => {
    // Recupera el estado del almacenamiento local si existe
    const savedState = localStorage.getItem('cashRegisterOpen');
    if (savedState !== 'undefined' && savedState !== null) {
      try {
        return JSON.parse(savedState);
      } catch (error) {
        console.error('Error parsing JSON from localStorage', error);
        return false;
      }
    }
    return false;
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Consulta inicial al backend para obtener el estado de la caja
    const fetchCashRegisterStatus = async () => {
      try {
        const response_data = await getStatusCaja(local)
        const accion = response_data.accion
        const isOpenDB = accion === 'abrir' ? true : false
        setIsOpenState(isOpenDB);
        // Guarda el estado en almacenamiento local
        localStorage.setItem('cashRegisterOpen', JSON.stringify(isOpenDB));
      } catch (error) {
        console.error('Error fetching cash register status from backend:', error);
      } finally {
        setLoading(false);
        // setIsOpenState(true)
      }
    };

    fetchCashRegisterStatus();
  }, []);

  const setIsOpen = async (isOpen: boolean) => {
    try {
      // Actualiza el estado en el backend
      const accion = isOpen ? 'abrir' : 'cerrar'
      const token = Cookies.get('auth_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await updateStatusCaja({ local, user:username, accion });
      // Actualiza el estado en el frontend
      setIsOpenState(isOpen);
      // Guarda el estado en almacenamiento local
      localStorage.setItem('cashRegisterOpen', JSON.stringify(isOpen));
    } catch (error) {
      console.error('Error updating cash register status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Puedes personalizar este mensaje de carga
  }

  return (
    <CashRegisterContext.Provider value={{ isOpen, setIsOpen, loading }}>
      {children}
    </CashRegisterContext.Provider>
  );
};

export const useCashRegister = (): CashRegisterContextType => {
  const context = useContext(CashRegisterContext);
  if (context === undefined) {
    throw new Error('useCashRegister must be used within a CashRegisterProvider');
  }
  return context;
};
