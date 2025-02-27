import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/contexts/auth-context';
import { useLocal } from '@/components/contexts/local-context';
import { useModal } from '../contexts/modal-context';
import { AiOutlineMenu } from 'react-icons/ai'; // Import a hamburger icon
import {ListaLocales} from '@/ListaLocales'

interface LinkCompProps {
  page: 'ventas' | 'clientes' | 'caja' | 'egresos' | 'productos' | 'proveedores' | 'usuarios' | 'empleados' | 'combos' | 'stock' | 'locales' | 'venta' | 'balance';
  active: string;
}

function capitalizeString(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const LinkComp: React.FC<LinkCompProps> = ({ page, active }) => (
  <Link
    to={page === 'ventas' ? `/${page}/nueva-venta` : page === 'stock' ?  `/${page}/modificar-stock` : `/${page}`}
    className={`block py-2 px-4 hover:bg-gray-3 ${page === active ? 'bg-gray-3' : ''}`}
  >
    {capitalizeString(page)}
  </Link>
);

const Modal: React.FC<{ localActivo: string; handleLocalSelection: (local: string) => void }> = ({ handleLocalSelection }) => {
  const locales = ListaLocales

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="relative bg-gray-1 p-4 rounded w-96 p-16">
        <div className="grid grid-cols-1 mb-4">
          {locales.map((local) => (
            <button
              key={local}
              className="mt-4 bg-gray-2 text-white px-4 py-2 rounded hover:bg-blue ml-8 mr-8"
              onClick={() => handleLocalSelection(local)}
            >
              {local}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const VerticalNavBar: React.FC<{ active: string }> = ({ active }) => {
  const { local, setLocal } = useLocal();
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [isNavModalOpen, openNavModal] = useState(false);

  const HideForEmployees: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (user && user.role === 'empleado') {
      return null;
    }
    return <>{children}</>;
  };

  const handleOpenNavModal = () => {
    openNavModal(true);
  }

  const handleCloseNavModal = () => {
    openNavModal(false);
  }

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/');
    }
  };

  const handleLocalSelection = (localActivo: string) => {
    setLocal(localActivo);
    closeModal();
  };

  const state = !isNavModalOpen && 'hidden'

  return (
    <>
      <nav className="md:flex md:flex-col md:w-64 md:h-full text-white bg-gray-2">
        {user && user.role === 'empleado' ?
          <div className="flex py-2 bg-blue">
            <h1 className="ml-16 md:ml-0 flex-1 text-2xl font-bold">{local}</h1>
            <div className="block md:hidden mr-8">
              <AiOutlineMenu className="text-white text-3xl cursor-pointer" onClick={handleOpenNavModal} />
            </div>
          </div>
          : false}
        <HideForEmployees>
          <div className="flex py-2 bg-blue hover:opacity-70 cursor-pointer">
            <h1 className="ml-16 md:ml-0 flex-1 text-2xl font-bold" onClick={openModal}>{local}</h1>
            <div className="block md:hidden mr-8">
              <AiOutlineMenu className="text-white text-3xl cursor-pointer" onClick={handleOpenNavModal} />
            </div>
          </div>
        </HideForEmployees>
        <div className={`${state} md:block`}>
          <div className={`${state} md:block fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-70 md:static md:inset-auto md:flex-none md:z-auto md:bg-transparent md:bg-opacity-0`} onClick={handleCloseNavModal}>
            <div className='max-z-30 bg-gray-2 p-4 w-96 md:max-z-auto md:bg-transparent md:p-0 md:w-auto'>
              <div className="py-2 bg-gray-4">
                <h1 className="text-2xl font-bold">Acceso Rápido</h1>
              </div>
              <ul className="flex flex-col space-y-auto">
                {['ventas', 'caja'].map((section) => (
                  <li key={section}>
                    <LinkComp page={section as LinkCompProps['page']} active={active} />
                  </li>
                ))}
              </ul>
              <div className="py-2 bg-gray-4">
                <h1 className="text-2xl font-bold">Parametría</h1>
              </div>
              <ul className="flex flex-col space-y-auto">
                {['egresos', 'stock'].map((section) => (
                  <li key={section}>
                    <LinkComp page={section as LinkCompProps['page']} active={active} />
                  </li>
                ))}
                {['productos', 'usuarios'].map((section) => (
                  <HideForEmployees>
                    <li  key={section}>
                      <LinkComp page={section as LinkCompProps['page']} active={active} />
                    </li>
                  </HideForEmployees>
                ))}
                {['proveedores'].map((section) => (
                  <li key={section}>
                    <LinkComp page={section as LinkCompProps['page']} active={active} />
                  </li>
                ))}
              </ul>
              <HideForEmployees>
                <div className="py-2 bg-gray-4">
                  <h1 className="text-2xl font-bold">Reportes</h1>
                </div>
              </HideForEmployees>
              <ul className="flex flex-col space-y-auto">
                {['venta', 'balance', 'egreso'].map((section) => (
                  <HideForEmployees>
                    <li key={section}>
                      <LinkComp page={section as LinkCompProps['page']} active={active} />
                    </li>
                  </HideForEmployees>
                ))}
                <li key={'cerrar-sesion'}>
                  <div
                    className="block py-2 px-4 hover:bg-gray-3 bg-red cursor-pointer"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav >
      {isModalOpen && user && user.role === 'admin' && <Modal localActivo={local} handleLocalSelection={handleLocalSelection} />
      }
    </>
  );
};

export default VerticalNavBar;
