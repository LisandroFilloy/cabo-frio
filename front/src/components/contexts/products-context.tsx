import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { getProductos, insertProducto, removeProducto, activateProducto, deactivateProducto } from '@/lib/apiCalls';
import { useLocal } from './local-context';

// Define the Product type
interface Product {
  id: number;
  nombre: string;
  precio_pesos: number;
  codigo: string;
  costo_pesos: number;
  cantidad: number;
  rubro: string;
  activo: boolean;
  stock: string;
  // Add any other fields you need
}

interface insertProductParams {
  local: string;
  nombre: string;
  precio_pesos: number;
  codigo: string;
  costo_pesos: number;
  cantidad: number;
  rubro: string;
  stock?: string;
  isUpdate?: boolean; // Indicador de actualización
  id?: number; // Permitir id solo cuando es una actualización
}

// Define the ProductsContext type
interface ProductsContextType {
  productsTable: Product[];
  productsObject: Record<string, Product>;
  removeProduct: (id: number) => void;
  insertProduct: (params: insertProductParams) => void;
  activateProduct: (id: number) => void;
  deactivateProduct: (id: number) => void;
  selectedProduct: Product | null; // To track the selected product for update
  setSelectedProduct: (product: Product | null) => void; // To set the selected product
}

// Create the context with a default value
export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Define the ProductsProvider component props type
interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Track selected product
  const { local } = useLocal();

  const fetchProductos = async () => {
    const response = await getProductos(local);

    if (!response) return;

    const fetchedProductos = response.data; // Access the data from the AxiosResponse

    if (!fetchedProductos) return; // Exit early if fetchedProductos is undefined or null

    // Format products into an array
    const formattedProducts = fetchedProductos.map((producto: any) => ({
      id: producto.id,
      nombre: producto.nombre,
      precio_pesos: producto.precio_pesos,
      codigo: producto.codigo,
      costo_pesos: producto.costo_pesos,
      cantidad: producto.cantidad,
      rubro: producto.rubro,
      stock: producto.stock,
      activo: producto.activo,
    }));

    setProducts(formattedProducts);
  };

  useEffect(() => {
    fetchProductos();
  }, [local]);

  const removeProduct = async (id: number) => {
    await removeProducto(id);
    fetchProductos();
  };

  const insertProduct = async (params: insertProductParams) => {
    try {
      await insertProducto(params);  // Asumiendo que esta función no devuelve un mensaje, sino que realiza la acción
      fetchProductos();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);  // Accede de forma segura al mensaje de error
      } else {
        console.error('Error desconocido al insertar producto');
      }
    }
  };
  

  const activateProduct = async (id: number) => {
    await activateProducto(id);
    fetchProductos();
  };

  const deactivateProduct = async (id: number) => {
    await deactivateProducto(id);
    fetchProductos();
  };

  // Convert products array to object for productsObject
  const productsObject = products.reduce((acc: Record<string, Product>, product) => {
    acc[product.codigo] = product;
    return acc;
  }, {});

  return (
    <ProductsContext.Provider
      value={{
        productsTable: products,
        productsObject,
        removeProduct,
        insertProduct,
        deactivateProduct,
        activateProduct,
        selectedProduct, // Provide the selected product
        setSelectedProduct, // Provide a way to set the selected product
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// Custom hook for accessing the products context
export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
