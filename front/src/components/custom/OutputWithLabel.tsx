import React from 'react';
import { Label } from '@/components/ui/label';

interface OutputWithLabelProps {
  label: string;
  value: string | number; // The value to be displayed
  className?: string;
}

const OutputWithLabel: React.FC<OutputWithLabelProps> = ({ label, value, className = 'w-48' }) => {
  return (
    <div className={`${className} grid text-start gap-3 mt-4`}>
      <Label className='font-normal h-[15px]' htmlFor={label}>{label}</Label>
      <div id={label} className="border p-2 rounded-md bg-white text-gray-3 h-10">
        {value}
      </div>
    </div>
  );
};

export default OutputWithLabel;
