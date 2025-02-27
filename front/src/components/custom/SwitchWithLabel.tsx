import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // Ensure this imports from the correct file

interface SwitchWithLabelProps {
  label: string;
  isActive: boolean;
  insideTable?: boolean;
  onCheckedChange: (newValue: boolean) => void; // Use onCheckedChange instead of onChange
}

const SwitchWithLabel: React.FC<SwitchWithLabelProps> = ({ label, isActive, insideTable = false, onCheckedChange }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${!insideTable && 'h-[72px]'}`}>
      <Switch
        id={label}
        checked={isActive} // Use checked for controlled state
        onCheckedChange={onCheckedChange} // Correct event handler
        className="bg-gray-3 data-[state=unchecked]:bg-gray-3"
      />
      {!(label === '') && <Label className='font-normal' htmlFor={label}>{label}</Label>}
    </div>
  );
};

export default SwitchWithLabel;
