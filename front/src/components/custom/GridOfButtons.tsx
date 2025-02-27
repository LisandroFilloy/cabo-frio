import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  listOfProductCodes: string[];
  buttonColor?: string;
  width?: string;
  maxHeight?: string;
  label: string;
  onProductClick?: (product: string) => void; // Add this prop
}

const ProductGrid: React.FC<ProductGridProps> = ({
  listOfProductCodes,
  buttonColor = 'bg-blue',
  width = 'w-96',
  label,
  onProductClick,
}) => {
  return (
    <div className='Flex text-start text-sm space-y-2'>
      <label>{label}</label>
      <div className={`grid gap-4 p-4 ${width} rounded bg-white max-h-64 min-h-48 overflow-y-auto 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2`}>
        {listOfProductCodes.map((product, index) => (
          <Button
            key={index}
            className={`w-full h-12 flex items-center justify-center ${buttonColor} text-white hover:${buttonColor} hover:opacity-85`}
            onClick={() => onProductClick?.(product)} // Handle click event
          >
            {product}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;