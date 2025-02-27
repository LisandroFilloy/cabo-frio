import React, { useState, useEffect } from 'react';
import VerticalNavBar from '@/components/custom/VerticalNavBar';
import CustomTable from '@/components/custom/Table';
import GridOfButtons from '@/components/custom/GridOfButtons';
import InputWithLabel from '../custom/InputWithLabel';
import SelectWithLabel from '../custom/SelectWithLabel';
import ActionBar from '../custom/ActionBar';
import { Link } from 'react-router-dom';
import { insertSale, getSales12h, removeSale, agregarStockValores } from '@/lib/apiCalls'
import { useLocal } from '@/components/contexts/local-context'
import { useProducts } from '@/components/contexts/products-context'


interface VentasProps {
  page_window: 'nueva-venta' | 'ventas-del-dia';
}

// interface row{
//   codigo:string,
//   nombre:string,
//   precio_pesos:number,
//   cantidad:string,
//   rubro: string,
//   costo_pesos: number,
//   peso_gramos: number
// }




const Ventas: React.FC<VentasProps> = ({ page_window }) => {
  const [rows, setRows] = useState<string[][]>([]);
  const [dailySalesRows, setDailySalesRows] = useState<(string | number)[][]>([]);
  const { local } = useLocal();
  const { productsObject } = useProducts();

  const fetchDailySalesRows = async () => {
    try {
      const response = await getSales12h(local);
      const formattedRows = response && response.data.map((obj: any) => {
        const formattedDate = new Date(obj.fecha_creacion).toLocaleString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', ' /');

        // Ensure total_pesos is a number, or use 0 as a fallback
        const totalPesosNumber = parseFloat(obj.total_pesos) || 0;
        const formattedTotalPesos = `$${totalPesosNumber.toFixed(2)}`;

        return [
          obj.nombre,
          formattedTotalPesos,
          formattedDate,
          obj.medio_de_pago,
          obj.tipo_venta,
          obj.productos,
          obj.id,
          obj.eliminada
        ];
      });
      setDailySalesRows(formattedRows);
    } catch (error) {
      console.error("Failed to fetch daily sales rows:", error);
    }
  };

  useEffect(() => {


    if (page_window === 'ventas-del-dia') {
      fetchDailySalesRows();
    }
  }, [local, page_window]);


  // Calculate totalValue as a number
  const totalValue = rows.reduce((acc, row) => {
    const price = parseFloat(row[2].replace('$', '').replace(',', '.')) || 0;
    const quantity = parseInt(row[3]) || 1;
    return acc + (price * quantity);
  }, 0);

  // State variables for form inputs
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [medioDePago, setMedioDePago] = useState('');
  const [tipoVenta, setTipoVenta] = useState('');
  const [deletedSale, setDeletedSale] = useState<(string | number)[] | null>(null);



  const handleConfirm = async () => {
    const productos = rows.reduce((acc, row) => {
      const [codigo, _, precio_pesos, cantidad, rubro, costo_pesos, peso_gramos] = row;
      acc[codigo] = {
        cantidad: Number(cantidad), // Replace with actual quantity if available
        precio_pesos: parseFloat(precio_pesos.replace('$', '').replace(',', '.')) || 0,
        precio_usd: 0, // Replaced in BE.
        rubro: rubro,
        costo_pesos: Number(costo_pesos.replace('$', '')),
        costo_usd: 0,
        peso_gramos: Number(peso_gramos)
      };
      return acc;
    }, {} as Record<string, { cantidad: number; precio_pesos: number; precio_usd: number, costo_usd: number, rubro: string, costo_pesos: number, peso_gramos: number }>);

    if (local === '' || nombre === '' || medioDePago === '' || tipoVenta === '') {
      alert("Por favor complete todos lo campos.")
      return
    }
    if (Object.keys(productos).length === 0) {
      alert("No hay ningun producto en la venta.")
      return
    }


    try {
      await insertSale({
        local,
        nombre,
        total_pesos: rows.reduce((acc, row) => acc + (parseFloat(row[2].replace('$', '').replace(',', '.')) || 0) * Number(row[3]), 0),
        productos: productos,
        direccion: direccion, // or other field
        medio_de_pago: medioDePago,
        tipo_venta: tipoVenta
      });

      setNombre('');
      setDireccion('');
      setMedioDePago('');
      setTipoVenta('');
      setRows([]);


      window.print()
      alert('Venta agregada!')


    } catch (error) {
      console.error("Error inserting sale:", error);
    }

    for (const codigo in productos) {
      const { cantidad } = productos[codigo];
      await agregarStockValores(local, codigo, cantidad);
    }
  };


  const handleAddProduct = (productCode: string) => {
    const productData = productsObject[productCode];
    const existingRowIndex = rows.findIndex(row => row[0] === productCode);

    if (existingRowIndex !== -1) {
      const updatedRows = [...rows];
      const currentQuantity = parseInt(updatedRows[existingRowIndex][3] || '1');
      updatedRows[existingRowIndex][3] = (currentQuantity + 1).toString();
      setRows(updatedRows);
    } else {
      const newRow = [productCode, productData.nombre, `$${productData.precio_pesos}`, '1', productData.rubro, `$${productData.costo_pesos}`, `${productData.cantidad}`]; // Initial quantity set to '1'
      setRows([...rows, newRow]);
    }
  };


  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const nuevaVentaButtonClass = page_window === 'nueva-venta'
    ? 'bg-gray-3'
    : 'bg-gray-2 hover:opacity-85';
  const ventasDelDiaButtonClass = page_window === 'ventas-del-dia'
    ? 'bg-gray-3'
    : 'bg-gray-2 hover:opacity-85';

  const removeLastColumns = (data: (string | number)[][]): (string | number)[][] => {
    const res: (string | number)[][] = [];
    data.forEach(row => {
      res.push(row.slice(0, -3))
    });
    return res
  }

  const GetLastColumn = (data: (string | number | boolean)[][]): (boolean)[] => {
    const res: (boolean)[] = [];
    data.forEach(row => {
      if (row.length > 0) {
        res.push(Boolean(row[row.length - 1])); // Get the last element of the row
      }
    });
    return res;
  };

  const removeColumns = (data: (string | number)[][]): (string | number)[][] => {
    const res: (string | number)[][] = [];
    data.forEach(row => {
      res.push(row.slice(0, -3))
    });
    return res
  }

  const handleRemoveRowTable2 = (index: number) => {
    if (index >= 0 && index < dailySalesRows.length) {
      // Guarda los datos de la venta eliminada
      const saleToBeRemoved = dailySalesRows[index];
      setDeletedSale(saleToBeRemoved);
      console.log('deletedSale', deletedSale)

      // Llama a la API para eliminar la venta
      const removalId = saleToBeRemoved[saleToBeRemoved.length - 2];
      removeSale(Number(removalId), local);

      // Actualiza las filas
      fetchDailySalesRows();
    } else {
      console.error('Invalid index:', index);
    }
  };

  useEffect(() => {
    if (deletedSale) {
      window.print(); // Ejecutar la impresión después de que el DOM se haya actualizado
    }
  }, [deletedSale]);


  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} / ${hours}:${minutes}`;
  };

  return (
    // Print
    <div>
      <div>
        <div className="hidden print:block text-[10px]">
          {page_window === "ventas-del-dia" && deletedSale && (
            <p className="font-bold mb-4">ELIMINADA</p>
          )}
          <p className="font-bold">Heladería Cabo Frio</p>
          <p className="mb-2">-----------------</p>

          {/* Sección para "nueva-venta" */}
          {page_window === "nueva-venta" && rows.length > 0 ? (
            <>
              <p className="mb-2">{nombre}</p>
              {rows.map((row, index) => {
                const quantity = parseInt(row[3]) || 0; // Parse quantity
                const price = parseFloat(row[2].replace("$", "").replace(",", ".")) || 0; // Parse price
                const total = (price * quantity).toFixed(2); // Calculate total
                return (
                  <p key={index} className="mt-2">
                    {quantity} {row[1]}: ${total}
                  </p>
                );
              })}
              <p className="mt-4 font-bold">Total: ${totalValue.toFixed(2)}</p>
              <p className="text-[8px] mt-8">{formatDateTime(new Date().toISOString())}</p>
            </>
          ) : null}

          {/* Sección para "ventas-del-dia" */}
          {page_window === "ventas-del-dia" && deletedSale ? (
            <>
              <p className="mt-2 font-bold">{deletedSale[0] || "N/A"}</p> {/* Nombre */}
              <p className="mt-2">Total: {deletedSale[1] || "N/A"}</p> {/* Total */}
              <p className="text-[8px] mt-8">{deletedSale[2] || "N/A"}</p> {/* Fecha */}
            </>
          ) : null}

          {/* Mensaje si no hay ventas eliminadas */}
          {page_window === "ventas-del-dia" && !deletedSale && (
            <p>No hay ventas eliminadas.</p>
          )}

          <p className="mt-4">-----------------</p>
          <p className="text-[8px] mt-8">Ticket no válido como factura.</p>

          {/* Espaciado adicional */}
          <p>-</p>
          <p>-</p>
          <p>-</p>
        </div>
      </div>


      <div className='md:flex bg-gray-1 w-screen min-h-screen print:hidden'>
        <div className='md:w-64'>
          <VerticalNavBar active='ventas' />
        </div>
        <div className='w-3/4 mx-auto'>
          <Link to='/Ventas/nueva-venta'>
            <button className={`${nuevaVentaButtonClass} p-4 w-48 text-white`}>Nueva Venta</button>
          </Link>
          <Link to='/Ventas/ventas-del-dia'>
            <button className={`${ventasDelDiaButtonClass} p-4 w-48 text-white`}>Ventas del día</button>
          </Link>
          {page_window === 'nueva-venta' ? (
            <>
              <div className='grid w-7/12 gap-8 m-8 grid-cols-1 lg:flex lg:w-auto'>
                <InputWithLabel
                  label={'Nombre'}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <InputWithLabel
                  className='md:w-96 w-64'
                  label={'Dirección'}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
                <SelectWithLabel
                  label={'Medios de Pago'}
                  value={medioDePago}
                  onChange={setMedioDePago}
                  placeholder='-'
                />
                <SelectWithLabel
                  label={'Tipo Venta'}
                  value={tipoVenta}
                  onChange={setTipoVenta}
                  placeholder='-'
                />
              </div>
              <div className="ml-8 mr-8 flex space-x-8 mb-4">
                <div className='flex-auto w-[300px]'>
                  <GridOfButtons
                    width='w-auto'
                    label='Productos'
                    listOfProductCodes={Object.keys(productsObject).filter(key => productsObject[key].activo)}
                    onProductClick={handleAddProduct}
                  />
                </div>
              </div>
              <div className='ml-8 mt-8 mr-8'>
                <CustomTable
                  removeColumn={true}
                  headers={['Código', 'Nombre Producto', 'Precio', 'cantidad']}
                  rows={removeColumns(rows)}
                  onRemoveRow={handleRemoveRow}
                />
              </div>
              <ActionBar addTotal={true} className='m-8' onConfirm={handleConfirm}
                totalValue={totalValue}>
              </ActionBar>
            </>
          ) : (
            <div className='ml-8 mt-8 mr-8'>
              <CustomTable removeColumn={true} headers={['Nombre', 'Monto total', 'Fecha/Hora', 'Medio de pago', 'Tipo de venta']} rows={removeLastColumns(dailySalesRows)} confirmOnRemove={true} onRemoveRow={handleRemoveRowTable2} eliminatedRows={GetLastColumn(dailySalesRows)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ventas;
