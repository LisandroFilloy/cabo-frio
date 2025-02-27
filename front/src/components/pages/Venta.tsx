import VerticalNavBar from '@/components/custom/VerticalNavBar';
import CustomTable from '@/components/custom/Table';
import SelectWithLabel from '../custom/SelectWithLabel';
import DateRangePicker from '@/components/custom/DateRangePicker';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useProducts } from '../contexts/products-context';
import { getFilteredVentas, getFilteredVentasBalance } from '@/lib/apiCalls';
import { useLocal } from '../contexts/local-context';
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";


// interface Row{
//     fecha: string,
//     producto: string,
//     tipoVenta: string,
//     precio:string,
//     medioDePago:string,
//     rubro:string
// }


// interface BalanceRow{
//     total_pesos: string,
//     medio_de_pago_mas_usado:string,
//     tipo_venta_mas_usado:string,
//     producto_mas_vendido:string,
//     promedio_precio_ventas:string,
//     kilos_vendidos:string
// }

const Stock = () => {
    const [rubro, setRubro] = useState('');
    const [producto, setProducto] = useState('');
    const [tipoVenta, setTipoVenta] = useState('');
    const [medioDePago, setMedioDePago] = useState('');
    const [fechaInicio, setFechaInicio] = useState('2024-01-01');
    const [fechaFin, setFechaFin] = useState('2024-12-12');
    const { productsObject } = useProducts();
    const [rows, setRows] = useState<any>([]);
    const [balanceRows, setBalanceRows] = useState<any>([]);
    const { local } = useLocal();

    const productOptions = Object.keys(productsObject).map((key) => ({
        label: key,
        value: key
    }));

    const fetchRows = async (fecha_inicio: string, fecha_fin: string) => {
        const result = await getFilteredVentas({
            local,
            rubro,
            producto,
            tipo_venta: tipoVenta,
            medio_de_pago: medioDePago,
            fecha_inicio,
            fecha_fin
        });

        const formattedRows = result && result.map((venta: any) => {
            const fecha = new Date(venta.fecha_creacion);
            const formattedFecha = fecha.toISOString().split('T')[0] + " / " + fecha.toTimeString().slice(0, 5);

            return [
                formattedFecha,
                venta.producto,
                venta.tipo_venta,
                `$${venta.precio_pesos}`,
                venta.cantidad,
                venta.medio_de_pago,
                venta.rubro
            ];
        });

        setRows(formattedRows);
    };

    const handleFetchRows = () => {
        fetchRows(fechaInicio, fechaFin);
        fetchBalanceRows(fechaInicio, fechaFin);

    };

    const fetchBalanceRows = async (fecha_inicio: string, fecha_fin: string) => {
        const result = await getFilteredVentasBalance({
            local,
            rubro,
            producto,
            tipo_venta: tipoVenta,
            medio_de_pago: medioDePago,
            fecha_inicio,
            fecha_fin
        });

        // Group results by 'key'
        const groupedResult = result.reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        // Map the grouped values to the required format
        const formattedRows = [
            `$${groupedResult.total_pesos}`,
            groupedResult.medio_de_pago_mas_usado,
            groupedResult.tipo_venta_mas_usado,
            groupedResult.producto_mas_vendido,
            `$${groupedResult.promedio_precio_ventas}`,
            groupedResult.kilos_vendidos
        ];

        setBalanceRows([formattedRows]);
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (range?.from) {
            setFechaInicio(format(range.from, "yyyy-MM-dd"));
        }
        if (range?.to) {
            setFechaFin(format(range.to, "yyyy-MM-dd"));
        }
    };


    return (
        <div className='md:flex bg-gray-1 w-screen min-h-screen'>
            <div className=''>
                <VerticalNavBar active='venta' />
            </div>
            <div className='w-11/12 md:w-3/4  mx-auto p-8 overflow-x-auto'>
                <div className='grid lg:gap-8 md:gap-4 md:grid-cols-2 grid-cols-1 lg:flex xl:flex'>
                    <SelectWithLabel label={'Rubro'} includeTodos={true} value={rubro} onChange={(value) => setRubro(value)} />
                    <SelectWithLabel label={'Producto'} options={productOptions} includeTodos={true} value={producto} onChange={(value) => setProducto(value)} />
                    <SelectWithLabel label={'Tipo Venta'} includeTodos={true} value={tipoVenta} onChange={(value) => setTipoVenta(value)} />
                    <SelectWithLabel label={'Medios de Pago'} includeTodos={true} value={medioDePago} onChange={(value) => setMedioDePago(value)} />
                </div>
                <div className='mt-4 md:flex lg:space-x-16 md:space-x-8 grid grid-cols-1 md:gap-4 gap-8'>
                    <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                    <Button onClick={handleFetchRows} className='bg-blue text-white mt-auto hover:bg-blue hover:opacity-85 md:w-48 w-36'>
                        Consultar
                    </Button>
                </div>
                <div className='mt-8'>
                    <CustomTable
                        headers={['Fecha', 'Producto', 'Tipo de venta', 'Precio', 'cantidad', 'Medio de pago', 'Rubro']}
                        rows={rows}
                    />
                </div>
                <div className='mt-8'>
                    <CustomTable
                        headers={['Total', 'Medio de pago mas usado', 'Tipo de venta mas usado', 'Producto mas vendido', 'Promedio precio venta kilox', 'kilos vendidos']}
                        rows={balanceRows}
                    />
                </div>
            </div>
        </div>
    );
};

export default Stock;
