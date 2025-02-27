import VerticalNavBar from '@/components/custom/VerticalNavBar';
import CustomTable from '@/components/custom/Table';
import DateRangePicker from '@/components/custom/DateRangePicker';
import { Button } from '@/components/ui/button';
import { getEgreso, getEgresosTotalesPorRubro } from '@/lib/apiCalls';
import { useLocal } from '../contexts/local-context';
import { useState } from 'react';
import { DateRange } from "react-day-picker";
import { format, parseISO } from 'date-fns';

const Egreso = () => {
    const { local } = useLocal();
    const [rows, setRows] = useState<any>([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [totalesPorRubro, setTotalesPorRubro] = useState<any[]>([]);

    const fetchTotalesPorRubro = async (fecha_inicio: string, fecha_fin: string) => {
        const response = await getEgresosTotalesPorRubro({
            fecha_inicio,
            fecha_fin,
            local
        });

        const result = response.results;

        const formattedTotals = result.map((row: any) => [
            row.rubro,
            `$${row.total}`
        ]);

        setTotalesPorRubro(formattedTotals);
    };

    const fetchRows = async (fecha_inicio: string, fecha_fin: string) => {
        const response = await getEgreso({
            fecha_inicio,
            fecha_fin,
            local
        });

        const result = response.results;

        const formattedRows = result.map((row: any) => [
            format(parseISO(row.fecha_egreso), "yyyy-MM-dd"),
            `$${row.monto}`,
            row.descripcion,
            row.rubro,
            row.usuario
        ]);

        setRows(formattedRows);
    };

    const handleFetchRows = () => {
        if (!fechaInicio || !fechaFin) {
            alert('Elegi una fecha');
            return;
        }
        fetchRows(fechaInicio, fechaFin);
        fetchTotalesPorRubro(fechaInicio, fechaFin); // Llama a esta función también
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
                <VerticalNavBar active='egreso' />
            </div>
            <div className='w-3/4 mx-auto'>
                <div className='lg:flex m-8 lg:space-x-8 grid grid-cols-1 gap-8'>
                    <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                    <Button onClick={handleFetchRows} className='bg-blue text-white mt-auto hover:bg-blue hover:opacity-85 w-36'>
                        Consultar
                    </Button>
                </div>
                <div className='ml-8 mt-8 mr-8'>
                    <CustomTable
                        headers={['Fecha', 'Monto', 'Descripción', 'Rubro', 'Usuario']}
                        rows={rows}
                    />
                </div>
                <div className='ml-8 mt-8 mr-8'>
                    <h2 className='text-md mb-4'>Totales por Rubro</h2>
                    <CustomTable
                        headers={['Rubro', 'Total']}
                        rows={totalesPorRubro}
                    />
                </div>
            </div>
        </div>
    );
};

export default Egreso;
