import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CashRegisterProvider } from '@/components/contexts/CashRegister-Context.tsx';
import { AuthProvider } from '@/components/contexts/auth-context.tsx'
import { NotificationProvider } from '@/components/contexts/role-context.tsx'
import { LocalProvider } from '@/components/contexts/local-context.tsx';
import { ModalProvider } from './components/contexts/modal-context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ModalProvider>
    <LocalProvider>
      <NotificationProvider>
        <AuthProvider>
          <CashRegisterProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </CashRegisterProvider>
        </AuthProvider>
      </NotificationProvider>
    </LocalProvider>
  </ModalProvider>
  ,
)
