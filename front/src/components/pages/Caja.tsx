import React, { useState, useEffect } from 'react';
import VerticalNavBar from '@/components/custom/VerticalNavBar';
import OutputWithLabel from '../custom/OutputWithLabel';
import CashRegister from '../custom/CashRegister';
import { useNotification } from '@/components/contexts/role-context';
import { useLocal } from '../contexts/local-context';
import { getStatusCaja, getMontoCaja, getValoresTicket, insertCorreccionCaja, sendEmail } from '@/lib/apiCalls';
import { formatCurrency } from '@/helpers';
import { useCashRegister } from '@/components/contexts/CashRegister-Context';

const Caja: React.FC = () => {
  const { message, setMessage } = useNotification();
  const [status, setStatus] = useState<{ fecha_ingreso: Date; accion: string; monto: string; usuario: string } | null>(null);
  const [monto, setMonto] = useState(0);
  const { local } = useLocal();
  const { isOpen, setIsOpen } = useCashRegister(); // Access CashRegister context
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [aperturaCaja, setAperturaCaja] = useState(0); // Input state for monto
  const [ingresoVentas, setIngresoVentas] = useState(0); // Input state for monto
  const [totalEgresos, setTotalEgresos] = useState(0); // Input state for monto
  const [total, setTotal] = useState(0); // Input state for monto
  const [cierreDeCaja, setCierreCaja] = useState(0); // Input state for monto

  useEffect(() => {
    if (message) {
      alert(message);
      setMessage('');
    }
  }, [message, setMessage]);

  const fetchStatus = async () => {
    try {
      const fetchedStatus = await getStatusCaja(local);
      setStatus(fetchedStatus);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const fetchMonto = async () => {
    const fetchedMonto = await getMontoCaja(local);
    setMonto(fetchedMonto);
  };

  useEffect(() => {
    fetchStatus(); // Fetch status on component mount
  }, [local]);

  useEffect(() => {
    fetchMonto();
  });

  const formatDateToCustomString = (dateString: Date): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} / ${hours}:${minutes}`;
  };

  const handleClickCashRegister = () => {
    // Open modal for confirmation, toggle will happen after confirmation\
    setCierreCaja(monto);
    setIsModalOpen(true);
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCierreCaja(Number(e.target.value)); // Update input value
  };

  const handleModalSubmit = async () => {
    // After confirming the modal input, toggle the cash register
    if (isOpen) {
      const text = await setValoresTicket();
      sendEmail('Cierre de caja', 'Lodeiro_la12@hotmail.com', text)
    }
    if (monto != cierreDeCaja) {
      insertCorreccionCaja(local, cierreDeCaja - monto);
    }
    await setIsOpen(!isOpen); // Toggle cash register open/close
    setIsModalOpen(false); // Close modal
    if (isOpen){
      window.print();
    }
  };

  const setValoresTicket = async () => {
    const data = await getValoresTicket(local);
    
    const aperturaCaja = data['aperturaCaja'];
    const ingresoVentas = data['ingresoVentas'];
    const totalEgresos = data['totalEgresos'];
    const total = data['total'];
    
    setAperturaCaja(aperturaCaja);
    setIngresoVentas(ingresoVentas);
    setTotalEgresos(totalEgresos);
    setTotal(total);

    // Formatting the values into a well-structured email body
    const emailBody = `
      Sucursal: ${local}
      Apertura Caja: ${aperturaCaja}
      Ingreso Ventas: ${ingresoVentas}
      Total Egresos: ${totalEgresos}
      Total: ${total}
      Cierre de caja: ${cierreDeCaja}
    `;
    
    return emailBody;
  };
  

  return (
    <>
      <div>
        <div className='hidden print:block text-[10px]'>
          <p className='font-bold'>Heladeria Cabo Frio</p>
          <p className='mb-2'>-----------------</p>
          <p className=''>Apertura de caja: ${aperturaCaja}</p>
          <p className=''>Ingreso por ventas: ${ingresoVentas}</p>
          <p className=''>Total egresos: ${totalEgresos}</p>
          <p className=''>Total: ${total}</p>
          <p className=''>Cierre de caja: ${cierreDeCaja}</p>
          <p>-</p>
          <p>-</p>
          <p>-</p>
        </div>
      </div>
      <div className='md:flex bg-gray-1 w-screen min-h-screen print:hidden'>
        <div>
          <VerticalNavBar active='caja' />
        </div>
        <div className='flex flex-col w-3/4 mx-auto'>
          <div className='lg:flex lg:space-x-8 m-8 space-y-4 grid grid-cols-1'>
            <OutputWithLabel
              label='Fecha/Hora Actualización'
              value={status ? formatDateToCustomString(status.fecha_ingreso) : ''}
            />
            <OutputWithLabel
              label='Monto'
              value={status ? formatCurrency(monto) : '$0'}
            />
            <OutputWithLabel
              label='Empleado'
              value={status ? status.usuario : ''}
            />
          </div>
          <div className='flex flex-1 m-8 lg:justify-center items-center'>
            <CashRegister onClick={handleClickCashRegister} isOpen={isOpen} /> {/* Pass isOpen as prop */}
          </div>
        </div>

        {isModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg'>
              <h2 className='text-lg font-bold mb-4'>Ingresa monto</h2>
              <input
                value={cierreDeCaja}
                onChange={handleInputChange}
                className='border p-2 w-full mb-4 border-black'
                placeholder='Monto'
              />
              <div className='flex justify-end space-x-4'>
                <button className='bg-red text-white px-4 py-2 rounded' onClick={handleModalClose}>
                  Cancelar
                </button>
                <button className='bg-green text-white px-4 py-2 rounded' onClick={handleModalSubmit}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Caja;
