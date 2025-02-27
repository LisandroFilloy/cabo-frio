import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";

interface NumericInputProps {
  label: string;
  min?: number;
  max?: number;
  value?: number; // Add value prop
  onValueChange?: (value: number) => void;
  className?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  label,
  min = 0,
  max = 100,
  value = 0, // Use value prop with default
  onValueChange,
  className = 'w-48', // Default className
}) => {
  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, [value, onValueChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    if (newValue === '') {
      onValueChange && onValueChange(min); // Reset to min if input is empty
    } else if (parseInt(newValue, 10) >= min && parseInt(newValue, 10) <= max) {
      onValueChange && onValueChange(parseInt(newValue, 10));
    }
  };

  const handleFocus = () => {
    if (value === 0) {
      onValueChange && onValueChange(NaN); // Set to empty
    }
  };

  const handleBlur = () => {
    if (isNaN(value)) {
      onValueChange && onValueChange(min); // Reset to min if empty on blur
    }
  };

  return (
    <div className={`${className} grid text-start gap-2 mt-4`}>
      <label htmlFor={label} className="font-normal text-sm h-[15px]">
        {label}
      </label>
      <Input
        id={label}
        type="text"
        value={isNaN(value) ? '' : value.toString()} // Display as empty if NaN
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="text-small"
      />
    </div>
  );
};

export default NumericInput;
