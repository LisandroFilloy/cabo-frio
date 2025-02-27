import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectWithLabelProps {
  label: string;
  options?: { value: string; label: string }[];
  value: string; // Add value prop
  onChange: (value: string) => void; // Add onChange prop
  placeholder?: string,
  includeTodos?: boolean
}

const SelectWithLabel: React.FC<SelectWithLabelProps> = ({ label, options = [], value, onChange, placeholder, includeTodos = false }) => {
  // Conditional options based on label
  if (options.length === 0) {
    if (label === 'Rubro') {
      options = [
        { value: 'heladeria', label: 'Heladería' },
        { value: 'cafeteria', label: 'Cafetería' },
        { value: 'mayorista', label: 'Mayorista' },
      ];
    }

    if (label === 'Medios de Pago') {
      options = [
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'tarjeta', label: 'Tarjeta' },
      ];
    }

    if (label === 'Tipo Venta') {
      options = [
        { value: 'delivery', label: 'Delivery' },
        { value: 'mostrador', label: 'Mostrador' },
        { value: 'empleado', label: 'Empleado' },
      ];
    }

    if (label === 'Rol') {
      options = [
        { value: 'empleado', label: 'Empleado' },
        { value: 'admin', label: 'Admin' },
      ];
    }
  }

  if (includeTodos && !options.some(option => option.value === 'todos')) {
    options.push({ value: 'todos', label: 'Todos' });
  }

  return (
    <div className="grid w-48 text-start gap-2 mt-4">
      <Label className='font-normal h-[15px]'>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ? placeholder : 'Todos'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithLabel;
