import VerticalNavBar from '@/components/custom/VerticalNavBar';
import CustomTable from '@/components/custom/Table';
import DateRangePicker from '@/components/custom/DateRangePicker';
import { Button } from '@/components/ui/button';
import { getBalance } from '@/lib/apiCalls';
import { useLocal } from '../contexts/local-context';
import { useState } from 'react';
import { DateRange } from "react-day-picker";
import { format } from 'date-fns';

const Balance = () => {
    const { local } = useLocal();
    const [rows, setRows] = useState<any>([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const fetchRows = async (fecha_inicio: string, fecha_fin: string) => {
        var result = await getBalance({
            fecha_inicio,
            fecha_fin,
            local
        });

        result = result.results

        const formattedRows =  [

                result.total_ventas,
                `$${result.total_costo_pesos}`,
                `$${result.total_costo_usd}`,
                `$${result.total_ganancia_pesos}`,
                `$${result.total_ganancia_usd}`,
                result.total_gramos
            ]

        setRows(formattedRows);
    };

    const handleFetchRows = () => {
        if(!fechaInicio || !fechaFin){
            alert('Elegi una fecha')
            return
        }
        fetchRows(fechaInicio, fechaFin);

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
                <VerticalNavBar active='balance' />
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
                        headers={['Total Ventas', 'Total costos (pesos)', 'Total costos (usd)', 'Total ganancia (pesos)', 'Total ganancia (usd)', 'Total gramos']}
                        rows={[rows]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Balance;
