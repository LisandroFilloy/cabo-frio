import { useState, useEffect } from 'react';
import VerticalNavBar from '@/components/custom/VerticalNavBar';
import CustomTable from '@/components/custom/Table';
import InputWithLabel from '../custom/InputWithLabel';
import SelectWithLabel from '../custom/SelectWithLabel';
import ActionBar from '../custom/ActionBar';
import { insertEgreso, getEgresos, getPendientes, removeEgreso, ejecutarEgreso } from '@/lib/apiCalls';
import { useLocal } from '../contexts/local-context';
import { useAuth } from '../contexts/auth-context';
import { formatCurrency, parseCurrency } from '@/helpers';

interface Egreso {
  descripcion: string;
  usuario: string;
  monto: number;
  fecha_egreso: string;
  rubro: string;
  id: number;
}

function formatDateString(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} / ${hours}:${minutes}`;
}


const Egresos = () => {
  const [monto, setMonto] = useState<string>('');
  const [rubro, setRubro] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [rows, setRows] = useState<Egreso[]>([]);
  const [pendientes, setPendientes] = useState<Egreso[]>([]);
  const { user } = useAuth();

  const { local } = useLocal();

  const fetchEgresos = async () => {
    const fetchedEgresos = await getEgresos(local, user?.username || '');
    setRows(fetchedEgresos || []);
  };

  const fetchPendientes = async () => {
    const fetchedPendientes = await getPendientes(local);
    setPendientes(fetchedPendientes || []);
  };

  useEffect(() => {
    fetchEgresos();
    fetchPendientes();
  }, [local]);

  const handleInsertEgreso = async () => {
    if (!monto || !rubro || !descripcion || (user && user.role == 'admin' && !tipo)) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const pendiente = Boolean(tipo && tipo === 'pendiente')

    const newEgreso = await insertEgreso(local, parseFloat(monto), rubro, descripcion, pendiente);
    if (newEgreso) {
      alert('Egreso ingresado con éxito.');
      setMonto('');
      setRubro('');
      setDescripcion('');
      setTipo('');
      await fetchEgresos(); // Refresh the table by fetching the latest data
      await fetchPendientes();
    }
  };

  // Transform the rows data into an array of arrays
  const transformedRows = rows.map((egreso) => [
    egreso.descripcion,
    egreso.usuario,
    `$${parseFloat(String(egreso.monto)).toFixed(2)}`, // Ensuring monto is formatted as a string with two decimal places
    formatDateString(egreso.fecha_egreso),
    egreso.rubro,
  ]);

  // Transform the pendientes data into an array of arrays
  const transformedPendientesRows = pendientes.map((egreso) => [ // todo replace rows with pendientes
    egreso.descripcion,
    egreso.usuario,
    `$${parseFloat(String(egreso.monto)).toFixed(2)}`, // Ensuring monto is formatted as a string with two decimal places
    formatDateString(egreso.fecha_egreso),
    egreso.rubro,
    false
  ]);

  const tipoOptions = [
    { value: 'ejecutado', label: 'Ejecutado' },
    { value: 'pendiente', label: 'Pendiente' }
  ]


  const handleRemoveRow = (index: number) => {
    const id = rows[index].id
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    removeEgreso(id);
    alert ('Egreso eliminado.')
    fetchEgresos();
  };

  const handleRemovePendiente = (index: number) => {
    const id = pendientes[index].id
    const updatedPendientes = rows.filter((_, i) => i !== index);
    setPendientes(updatedPendientes);
    removeEgreso(id);
    alert ('Egreso eliminado.')
    fetchPendientes();
  };

  const handleExecuteRow = (id: number) => {
    const pendiente = pendientes.find((egreso) => egreso.id === id); // Busca el egreso con el id dado
    if (!pendiente) {
      alert('No se encontró el egreso.');
      return;
    }
  
    const updatedPendientes = pendientes.filter((egreso) => egreso.id !== id); // Filtra los pendientes eliminando el ejecutado
    setPendientes(updatedPendientes);
  
    ejecutarEgreso(local, pendiente.monto, pendiente.rubro, pendiente.descripcion, false, pendiente.id);
    alert('Egreso ejecutado.');
    fetchPendientes();
  };

  const optionsRubro = [
    { value: 'cafeteria', label: 'Cafetería' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'empleado', label: 'Empleado' },
    { value: 'heladeria', label: 'Heladería' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'retiro', label: 'Retiro' },
    { value: 'otros', label: 'Otros' },
  ];
  

  return (
    <div className='md:flex bg-gray-1 w-screen min-h-screen'>
      <div className=''>
        <VerticalNavBar active='egresos' />
      </div>
      <div className='w-3/4 mx-auto'>
        <div className='lg:flex m-8 lg:space-x-8 space-y-4'>
          <InputWithLabel label={'Monto'} value={formatCurrency(Number(monto))} onChange={(e) => setMonto(String(parseCurrency(e.target.value)))} />
          <SelectWithLabel label={'Rubro'} placeholder='-' options={optionsRubro} value={rubro} onChange={(value) => setRubro(value)} />
          <InputWithLabel className='md:w-96 w-64' label={'Descripción'} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          {user && user.role === 'admin' && <SelectWithLabel placeholder='-' options={tipoOptions} label={'Tipo'} value={tipo} onChange={(value) => setTipo(value)} />}
        </div>
        <div className='ml-8 mt-8 mr-8'>
          <CustomTable removeColumn={true} headers={['Descripción', 'Usuario', 'Monto', 'Fecha', 'Rubro']} rows={transformedRows} confirmOnRemove={true} onRemoveRow={handleRemoveRow} />
        </div>
        {user && user.role === 'admin' &&
          <div className='ml-8 mt-8 mr-8'>
            <p className='text-start mb-4'>Egresos pendientes</p>
            <div>
              <CustomTable removeColumn={true} onRemoveRow={handleRemovePendiente} ids={pendientes.map(pendiente => pendiente.id)} onActivateRow={handleExecuteRow} activado={false} headers={['Descripción', 'Usuario', 'Monto', 'Fecha', 'Rubro', 'Ejecutar']} rows={transformedPendientesRows} confirmOnRemove={true} />
            </div>
          </div>
        }
        <ActionBar className='m-8' onConfirm={handleInsertEgreso} />
      </div>
    </div>
  );
};

export default Egresos;
