import { useEffect, useState } from 'react';
import VerticalNavBar from '@/components/custom/VerticalNavBar';
import CustomTable from '@/components/custom/Table';
import InputWithLabel from '../custom/InputWithLabel';
import ActionBar from '../custom/ActionBar';
import NumericInput from '../custom/NumericInput';
import SelectWithLabel from '../custom/SelectWithLabel';
import { useLocal } from '../contexts/local-context';
import { useProducts } from '../contexts/products-context';
import { formatCurrency, parseCurrency } from '@/helpers';
import { getStock } from '@/lib/apiCalls';

// Define the type for rows
type RowData = string | number | boolean;

interface StockItem {
    cantidad: number;
    tipo: 'unidades' | 'kilos';
}

interface StockRows {
    [nombre: string]: StockItem;
}

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

const Productos = () => {
    const [nombre, setNombre] = useState('');
    const [precioPesos, setPrecioPesos] = useState(0);
    const [codigo, setCodigo] = useState('');
    const [costoPesos, setCostoPesos] = useState(0);
    const [cantidad, setCantidad] = useState(0);
    const [tipo, setTipo] = useState('');
    const [stock, setStock] = useState('');
    const [rubro, setRubro] = useState('');
    const { local } = useLocal();
    const [stockRows, setStockRows] = useState<StockRows>({});
    const { productsTable, removeProduct, insertProduct, deactivateProduct, activateProduct } = useProducts();

    // Añadir estado para el producto seleccionado
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);  // Cambié el tipo a `Product`

    const fetchStock = async () => {
        const res = await getStock(local);
        setStockRows(res);
    }

    // Correctly typed state for rows and ids
    const [rows, setRows] = useState<RowData[][]>([]);
    const [ids, setIds] = useState<number[]>([]);

    useEffect(() => {
        fetchStock();
    }, [])

    useEffect(() => {
        const updatedRows = productsTable.map(product => [
            product.rubro,
            product.nombre,
            formatCurrency(product.precio_pesos),
            product.codigo,
            formatCurrency(product.costo_pesos),
            `${product.cantidad}g`,
            product.stock,
            product.activo // Convert boolean to string
        ]);
        setRows(updatedRows);
        setIds(productsTable.map(product => product.id));
    }, [productsTable]);

    const handleAddProduct = async () => {
        if (!nombre || !rubro || !precioPesos || !codigo || !costoPesos || !cantidad) {
            alert('Por favor, complete todos los campos.');
            return;
        }
    
        const isUpdate = selectedProduct !== null; // Flag para saber si estamos actualizando un producto
    
        try {
            await insertProduct({
                local, 
                nombre, 
                precio_pesos: precioPesos, 
                codigo, 
                costo_pesos: costoPesos, 
                cantidad: cantidad, 
                rubro, 
                stock,
                isUpdate, // Se pasa el parámetro isUpdate al backend
                id: isUpdate ? selectedProduct.id : undefined // Solo enviar el ID si estamos actualizando
            });           
    
            // Limpiar los campos después de la operación
            setNombre('');
            setPrecioPesos(0);
            setCodigo('');
            setCostoPesos(0);
            setCantidad(0);
            setRubro('');
            setSelectedProduct(null); // Limpiar el producto seleccionado
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message); // Mostrar mensaje de error si ocurre un fallo
            } else {
                alert('Error al procesar la solicitud. Intente nuevamente.');
            }
        }
    };
    

    const handleRemoveProducto = async (index: number) => {
        await removeProduct(ids[index]);
    };

    const stockOptions = Object.entries(stockRows).map(([nombre]) => {
        return { value: nombre, label: nombre }; // You don't need to wrap it in an array
    });


    return (
        <div className='md:flex bg-gray-1 w-screen min-h-screen'>
            <div className=''>
                <VerticalNavBar active='productos' />
            </div>
            <div className='w-3/4 mx-auto'>
                <div className='xl:flex m-8 xl:space-x-8 grid lg:grid-cols-3 md:grid-cols-2'>
                    <InputWithLabel
                        value={nombre}
                        label={'Nombre'}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <InputWithLabel
                        value={formatCurrency(precioPesos)}
                        label={'Precio'}
                        onChange={(e) => setPrecioPesos(parseCurrency(e.target.value))}
                    />
                    <InputWithLabel
                        value={codigo}
                        label={'Código'}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                    <InputWithLabel
                        value={formatCurrency(costoPesos)}
                        label={'Costo'}
                        onChange={(e) => setCostoPesos(parseCurrency(e.target.value))}
                    />
                    <SelectWithLabel
                        label={'Rubro'}
                        placeholder='-'
                        onChange={setRubro}
                        value={rubro}
                    />
                    <SelectWithLabel
                        value={tipo}
                        label={'Tipo'}
                        options={[
                            { value: 'unidades', label: 'Unidades' },
                            { value: 'gramos', label: 'Gramos' }
                        ]}
                        onChange={(e) => setTipo(e)}
                    />
                    <NumericInput
                        max={3000}
                        label={!tipo ? '' : tipo === 'unidades' ? 'Unidades' : 'Peso (gramos)'}
                        onValueChange={setCantidad}
                        value={cantidad}
                    />
                    <SelectWithLabel
                        value={stock}
                        label={'Stock'}
                        options={stockOptions}
                        onChange={(e) => setStock(e)}
                    />
                </div>
                <div className='ml-8 mt-8 mr-8'>
                    <CustomTable
                        headers={['Rubro', 'Nombre', 'Precio', 'Código', 'Costo', 'Cantidad', 'Stock', 'Activo']}
                        rows={rows}
                        confirmOnRemove={true}
                        onRemoveRow={handleRemoveProducto}
                        ids={ids}
                        onActivateRow={activateProduct}
                        onDeactivateRow={deactivateProduct}
                        isRowClickable={true} // Pasar true para hacer que las filas sean clickeables
                        onRowClick={(index) => {
                            // Aquí puedes definir lo que sucede al hacer clic en una fila
                            const selectedProduct = productsTable[index];
                            setNombre(selectedProduct.nombre);
                            setPrecioPesos(selectedProduct.precio_pesos);
                            setCodigo(selectedProduct.codigo);
                            setCostoPesos(selectedProduct.costo_pesos);
                            setCantidad(selectedProduct.cantidad);
                            setRubro(selectedProduct.rubro);
                            setStock(selectedProduct.stock);
                            setSelectedProduct(selectedProduct); // Establecer el producto seleccionado
                        }}
                    />
                </div>
                <p className='mt-8'>Nota: selecciona fila para actualizar valores.</p>
                <ActionBar className='m-8' onConfirm={handleAddProduct} />
            </div>
        </div>
    );
};

export default Productos;
