import VerticalNavBar from '@/components/custom/VerticalNavBar'
import CustomTable from '@/components/custom/Table'
import InputWithLabel from '../custom/InputWithLabel';
import ActionBar from '../custom/ActionBar';
import SelectWithLabel from '../custom/SelectWithLabel';
import { useEffect, useState } from 'react';
import { useLocal } from '../contexts/local-context';
import { getProveedores, removeProveedor, insertProveedor, activateProveedor, deactivateProveedor } from '@/lib/apiCalls';

interface Proveedor {
    id: number;
    nombre: string;
    telefono: string;
    email: number;
    rubro: string;
    activo: string;
}

const Proveedores = ({ }) => {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [rubro, setRubro] = useState('');
    const [rows, setRows] = useState<Proveedor[]>([]);

    const { local } = useLocal();

    const fetchProveedores = async () => {
        const fetchedProveedores = await getProveedores(local);

        // Assuming fetchedProveedores is an array of objects with similar keys to the Proveedor interface
        const formattedProveedores = fetchedProveedores && fetchedProveedores.map((prov: any) => ({
            id: prov.id,          // Assuming there's an 'id' field in the fetched data
            nombre: prov.nombre,
            telefono: prov.telefono,
            email: prov.email,
            rubro: prov.rubro,
            activo: prov.activo   // Assuming there's an 'activo' field
        }));
        setRows(formattedProveedores || []);
    };

    useEffect(() => {
        fetchProveedores();
    }, [local]);


    const handleRemoveProveedor = async (index: number) => {
        const res = await removeProveedor(rows[index]['id']);
        if(res){
            alert('Proveedor eliminado')
        };
        fetchProveedores();
    }


    const handleInsertProveedor = async () => {
        if (!nombre || !telefono || !email || !rubro) {
          alert('Por favor, complete todos los campos.');
          return;
        }
    
        const newProveedor = await insertProveedor({local, nombre, telefono, email, rubro} );
        if (newProveedor) {
          alert('Egreso ingresado con éxito.');
          setNombre('');
          setTelefono('');
          setEmail('');
          setRubro('');
          await fetchProveedores(); // Refresh the table by fetching the latest data
        }
      };

    const handleDeactivateProveedor = async (id: number) => {
        await deactivateProveedor(id);
    };   
    
    const handleActivateProveedor = async (id: number) => {
        await activateProveedor(id)
    }; 
    

    return <div className='md:flex bg-gray-1 w-screen min-h-screen'>
        <div className=''>
            <VerticalNavBar active='proveedores' />
        </div>
        <div className='w-3/4 mx-auto'>
            <div className='lg:flex m-8 lg:space-x-8 '>
                <InputWithLabel label={'Nombre'} value={nombre} onChange={(e) => setNombre(e.target.value)}></InputWithLabel>
                <InputWithLabel label={'Telefono'} value={telefono} onChange={(e) => setTelefono(e.target.value)}></InputWithLabel>
                <InputWithLabel label={'Email'} value={email} onChange={(e) => setEmail(e.target.value)} className='md:w-96'></InputWithLabel>
                <SelectWithLabel label={'Rubro'} value={rubro} onChange={(value) => setRubro(value)}></SelectWithLabel>
            </div>
            <div className='ml-8 mt-8 mr-8'>
                <CustomTable
                    removeColumn={true}
                    headers={['Rubro', 'Nombre', 'Teléfono', 'Email', 'Activo']}
                    rows={rows.map(row => [
                        row.rubro,
                        row.nombre,
                        row.telefono,
                        row.email,
                        row.activo
                    ])} 
                    confirmOnRemove={true}
                    ids={rows.map(row => row.id)}
                    onRemoveRow={handleRemoveProveedor}
                    onDeactivateRow={handleDeactivateProveedor}
                    onActivateRow={handleActivateProveedor}
                    >
                </CustomTable>
            </div>
            <ActionBar className='m-8' onConfirm={handleInsertProveedor}></ActionBar>
        </div>
    </div>
}

export default Proveedores 