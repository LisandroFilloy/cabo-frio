import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputWithLabelProps {
  label: string;
  value?: string; // Add value prop
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
  className?: string;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({ label, value, onChange, className = 'w-48' }) => {
  return (
    <div className={`${className} grid text-start gap-2 mt-4`}>
      <Label className='font-normal h-[15px]' htmlFor={label}>{label}</Label>
      <Input
        id={label}
        value={value} // Set value of input
        onChange={onChange} // Handle input change
      />
    </div>
  );
};

export default InputWithLabel;
