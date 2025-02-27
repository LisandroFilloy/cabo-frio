import VerticalNavBar from '@/components/custom/VerticalNavBar'
import CustomTable from '@/components/custom/Table'
import InputWithLabel from '../custom/InputWithLabel';
import ActionBar from '../custom/ActionBar';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import SelectWithLabel from '../custom/SelectWithLabel';
import { useLocal } from '../contexts/local-context';
import { getStock, insertStock, removeStock, getStockLastMovements, crearStock } from '@/lib/apiCalls';
import { formatDate } from '@/helpers'

interface StockProps {
    page_window: 'modificar-stock' | 'nuevo-stock' | 'ultimos-movimientos';
}

interface StockItem {
    cantidad: number;
    tipo: 'unidades' | 'gramos';
}

interface StockRows {
    [nombre: string]: StockItem;
}

const Stock: React.FC<StockProps> = ({ page_window }) => {
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState('');
    const [stock, setStock] = useState('');
    const [modif, setModif] = useState('');
    const [cantidad, setCantidad] = useState(0);
    const [lastMovements, setLastMovements] = useState([])
    const [stockRows, setStockRows] = useState<StockRows>({});
    const { local } = useLocal();

    const modificarStockButtonClass = page_window === 'modificar-stock'
        ? 'bg-gray-3'
        : 'bg-gray-2 hover:opacity-85';
    const nuevoStockButtonClass = page_window === 'nuevo-stock'
        ? 'bg-gray-3'
        : 'bg-gray-2 hover:opacity-85';
    const ultimosMovimientosButtonClass = page_window === 'ultimos-movimientos'
        ? 'bg-gray-3'
        : 'bg-gray-2 hover:opacity-85';

    const tipoOptions = [
        { value: 'unidades', label: 'Unidades' },
        { value: 'gramos', label: 'Gramos' }
    ]


    const modificarOptions = [
        { value: 'agregar', label: 'Agregar' },
        { value: 'descontar', label: 'Descontar' }
    ]

    useEffect(() => {
        fetchStock();
        fetchLastMovements();
    }, [])

    const fetchLastMovements = async () => {
        const res = await getStockLastMovements(local)
        setLastMovements(res);
    }

    const fetchStock = async () => {
        const res = await getStock(local)
        setStockRows(res);
    }

    const handleRemoveStock = async (index: number) => {
        const _nombre = rowsCustomTable1[index][0]
        const response = await removeStock(local, _nombre)
        fetchStock();
        if(response){
            alert('Stock eliminado')
        };

    }


    const handleInsertStockMovement = async () => {
        if (!stock || !cantidad || !modif) {
            alert('Por favor complete todos los campos')
        } else {
            const agrega = modif === 'agregar'
            const tipo = stockRows[stock]['tipo']
            insertStock({ local, nombre: stock, cantidad, tipo, agregar: agrega })
            alert('Modificacion de stock completada')
            fetchStock();
            fetchLastMovements();
            setStock('')
            setModif('')
            setCantidad(0)
        }
    }

    const handleCreateStock = async () => {

        if (!nombre || !tipo) {
            alert('Por favor complete todos los campos')
        } else {
            insertStock({ local, nombre, cantidad: 0, tipo, agregar: true })
            crearStock(local, nombre)
            alert('Stock creado')
            fetchStock();
            setNombre('');
            setTipo('');
        }
    }

    const stockOptions = Object.entries(stockRows).map(([nombre]) => {
        return { value: nombre, label: nombre }; // You don't need to wrap it in an array
    });


    const rowsCustomTable1 = Object.entries(stockRows).map(([nombre, data]) => {
        const cantidad = data['cantidad'];
        const tipo = data['tipo']
        const cantidad_kilos = cantidad / 1000
        const cantidad_string = tipo === 'unidades' ? `${cantidad} unidades` : `${cantidad} gramos = ${cantidad_kilos}kg`
        return [nombre, cantidad_string]
    }
    );

    const rowsCustomTable2 = lastMovements.map((row) => {
        const cantidad = row['cantidad'];
        const tipo = row['tipo']
        const accion = row['agregar'] ? 'Agregar' : 'Descontar'
        const cantidad_kilos = cantidad / 1000
        const cantidad_string = tipo === 'unidades' ? `${cantidad} unidades` : `${cantidad} gramos = ${cantidad_kilos}kg`;
        const fecha = new Date(row['fecha_creacion'])
        const formattedFecha = formatDate(fecha)
        return [row['nombre'], accion, cantidad_string, formattedFecha]
    }
    );

    return <div className='md:flex bg-gray-1 w-screen min-h-screen'>
        <div className=''>
            <VerticalNavBar active='stock' />
        </div>
        <div className='w-3/4 mx-auto'>
            <Link to='/stock/modificar-stock'>
                <button className={` ${modificarStockButtonClass} p-4 w-48 text-white`}>Modificar Stock</button>
            </Link>
            <Link to='/stock/nuevo-stock'>
                <button className={` ${nuevoStockButtonClass} p-4 w-48 text-white`}>Nuevo Stock</button>
            </Link>
            <Link to='/stock/ultimos-movimientos'>
                <button className={` ${ultimosMovimientosButtonClass} p-4 w-48 text-white`}>Ultimos Movimientos</button>
            </Link>
            {page_window === 'modificar-stock' ?

                <>
                    <div className='flex m-8 space-x-8'>
                        <SelectWithLabel label={'Stock'} placeholder='-' value={stock} options={stockOptions} onChange={value => setStock(value)}></SelectWithLabel>
                        <SelectWithLabel value={modif} label={'acción'} options={modificarOptions} placeholder='-' onChange={(value) => setModif(value)}></SelectWithLabel>
                        <InputWithLabel
                            label={'Cantidad'}
                            value={`${String(cantidad)}`}
                            onChange={e => setCantidad(Number(e.target.value))}
                        />
                    </div>
                    <div className='ml-8 mt-8 mr-8'>
                        <CustomTable removeColumn={true} headers={['Nombre', 'Cantidad']} rows={rowsCustomTable1} confirmOnRemove={true} onRemoveRow={handleRemoveStock}>
                        </CustomTable>
                    </div>
                    <ActionBar className='m-8' onConfirm={handleInsertStockMovement}></ActionBar>
                </> : page_window === 'nuevo-stock' ?
                    <>
                        <div className='flex m-8 space-x-8'>
                            <InputWithLabel label={'Nombre'} value={nombre} onChange={e => setNombre(e.target.value)}></InputWithLabel>
                            <SelectWithLabel value={tipo} label={'Tipo de stock'} options={tipoOptions} placeholder='-' onChange={(value) => setTipo(value)}></SelectWithLabel>
                        </div>
                        <div className='ml-8 mt-8 mr-8'>
                            <CustomTable removeColumn={true} headers={['Nombre', 'Cantidad']} rows={rowsCustomTable1} confirmOnRemove={true} onRemoveRow={handleRemoveStock}>
                            </CustomTable>
                        </div>
                        <ActionBar className='m-8' onConfirm={handleCreateStock}></ActionBar>

                    </>

                    : <div className='ml-8 mt-8 mr-8 '>
                        <h2 className='text-start mb-2'>Últimos movimientos</h2>
                        <CustomTable headers={['Nombre', 'acción', 'cantidad', 'fecha']} rows={rowsCustomTable2}>
                        </CustomTable>
                    </div>}


        </div>
    </div>
}

export default Stock 