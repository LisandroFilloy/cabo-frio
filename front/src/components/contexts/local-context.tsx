import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface LocalContextType {
  local: string;
  setLocal: (local: string) => void;
}

// Create the context with default values
const LocalContext = createContext<LocalContextType | undefined>(undefined);

// Create a provider component
export const LocalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [local, setLocalState] = useState<string>(() => {
    // Retrieve the initial value from Local Storage or use default
    return localStorage.getItem('local') || 'A. Baranda';
  });

  // Update the Local Storage whenever `local` changes
  const setLocal = (newLocal: string) => {
    setLocalState(newLocal);
    localStorage.setItem('local', newLocal);
  };

  return (
    <LocalContext.Provider value={{ local, setLocal }}>
      {children}
    </LocalContext.Provider>
  );
};

// Custom hook to use the LocalContext
export const useLocal = () => {
  const context = useContext(LocalContext);
  if (!context) {
    throw new Error('useLocal must be used within a LocalProvider');
  }
  return context;
};
