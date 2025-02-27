import React from 'react';

interface CashRegisterProps {
  onClick?: () => void; // Optional onClick prop passed from parent
  isOpen: boolean; // isOpen state is now passed as a prop
}

const CashRegister: React.FC<CashRegisterProps> = ({ onClick, isOpen }) => {
  return (
    <div
      onClick={onClick} // Trigger the onClick passed from the parent
      className={`relative w-64 h-64 lg:w-96 lg:h-96 hover:opacity-60 cursor-pointer ${
        isOpen ? 'bg-green' : 'bg-red'
      } rounded-lg`}
    >
      <div className="absolute top-0 left-0 mt-4 ml-4 text-white text-xl">
        {isOpen ? 'Abierta' : 'Cerrada'}
      </div>
      <div className="flex items-center justify-center h-full">
        <img src="/cash-register.svg" alt="Cash Register" className="w-32 lg:w-64 lg:h-64" />
      </div>
    </div>
  );
};

export default CashRegister;
