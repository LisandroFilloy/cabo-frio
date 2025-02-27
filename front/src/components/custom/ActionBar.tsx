import React from 'react';
import { Button } from '@/components/ui/button';

// Define the type for the props
interface ActionBarProps {
  addTotal?: boolean;
  totalValue?: number; // Optional prop for the total value
  className?: string;
  onConfirm?: () => void; // Add the onConfirm prop
}

function reloadPage() {
  window.location.reload();
}

const ActionBar: React.FC<ActionBarProps> = ({ className = 'w-1/2', addTotal = false, totalValue = 0, onConfirm }) => {
  return (
    <div className={`md:flex items-center bg-gray-3 rounded pt-2 pl-4 pr-4 pb-2 items-center ${className} space-y-4 md:space-y-0 mb-0`}>
      {addTotal && (
        <div className="flex items-center space-x-2 mr-auto justify-center">
          <span className="text-white">Total:</span>
          <div className="bg-white px-2 py-1 rounded w-24">
            <span className="text-gray-4 px-2 rounded">${totalValue}</span>
          </div>
        </div>
      )}
      <div className="ml-auto space-x-2">
        <Button className="bg-red text-white hover:bg-red hover:opacity-85 text-xs md:text-sm p-2 md:p-4" onClick={reloadPage}>Cancelar</Button>
        <Button
          className="bg-green text-white hover:bg-green hover:opacity-85 text-xs md:text-sm p-2 md:p-4"
          onClick={onConfirm} // Attach the onConfirm handler
        >
          Aceptar
      </Button>
      </div>
    </div>
  );
};

export default ActionBar;
