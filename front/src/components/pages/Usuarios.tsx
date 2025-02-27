import VerticalNavBar from '@/components/custom/VerticalNavBar'
import CustomTable from '@/components/custom/Table'
import InputWithLabel from '../custom/InputWithLabel';
import ActionBar from '../custom/ActionBar';
import SelectWithLabel from '../custom/SelectWithLabel';
import { useEffect, useState } from 'react';
import { getUsuarios, removeUsuario, insertUsuario, activateUsuario, deactivateUsuario } from '@/lib/apiCalls';
import { useLocal } from '../contexts/local-context';

interface Usuario {
    id: number
    usuario: string;
    clave: string;
    nombre: string;
    apellido: string;
    telefono: string;
    documento: string;
    rol: string;
    local: string;
    activo: boolean;
}

const Productos = ({ }) => {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [documento, setDocumento] = useState('');
    const [rol, setRol] = useState('');
    const [rows, setRows] = useState<Usuario[]>([]);


    const { local } = useLocal();

    const fetchUsuarios = async () => {
        const fetchedProveedores = await getUsuarios(local);

        // Assuming fetchedProveedores is an array of objects with similar keys to the Proveedor interface
        const formattedUsuarios = fetchedProveedores && fetchedProveedores.map((Usuario: any) => ({
            id: Usuario.id,
            usuario: Usuario.usuario,       // Assuming there's an 'id' field in the fetched data
            clave: Usuario.clave,
            nombre: Usuario.nombre,
            apellido: Usuario.apellido,
            telefono: Usuario.telefono,
            documento: Usuario.documento,
            rol: Usuario.rol,
            local: Usuario.local,
            activo: Usuario.activo   // Assuming there's an 'activo' field
        }));
        setRows(formattedUsuarios || []);
    };

    useEffect(() => {
        fetchUsuarios();
    }, [local]);


    const handleInsertUsuario = async () => {
        if (!usuario || !clave || !nombre || !apellido || !documento || !rol) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const newUsuario = await insertUsuario({ local, usuario, clave, rol, nombre, apellido, telefono, documento });
        if (newUsuario) {
            alert('Egreso ingresado con éxito.');
            setNombre('');
            setUsuario('');
            setClave('');
            setRol('');
            setApellido('');
            setTelefono('');
            setDocumento('');
        }
        fetchUsuarios();
    };

    const handleRemoveUsuario = async (index: number) => {
        const res = await removeUsuario(rows[index]['id']);
        if (res) {
            alert('Usuario eliminado')
        };
        fetchUsuarios();
    }

    const handleDeactivateUsuario = async (id: number) => {
        await deactivateUsuario(id);
    };   
    
    const handleActivateUsuario = async (id: number) => {
        await activateUsuario(id)
    }; 
    

    return <div className='md:flex bg-gray-1 w-screen min-h-screen'>
        <div className=''>
            <VerticalNavBar active='usuarios' />
        </div>
        <div className='w-3/4 mx-auto'>
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 m-8 gap-4'>
                <InputWithLabel label={'Usuario'} value={usuario} onChange={(e) => setUsuario(e.target.value)} ></InputWithLabel>
                <InputWithLabel label={'Clave'} value={clave} onChange={(e) => setClave(e.target.value)} ></InputWithLabel>
                <InputWithLabel label={'Nombre'} value={nombre} onChange={(e) => setNombre(e.target.value)} ></InputWithLabel>
                <InputWithLabel label={'Apellido'} value={apellido} onChange={(e) => setApellido(e.target.value)} ></InputWithLabel>
                <InputWithLabel label={'Telefono'} value={telefono} onChange={(e) => setTelefono(e.target.value)} ></InputWithLabel>
                <InputWithLabel label={'Numero de Doc.'} value={documento} onChange={(e) => setDocumento(e.target.value)} ></InputWithLabel>
                <SelectWithLabel label={'Rol'} value={rol} onChange={(e) => setRol(e)}  ></SelectWithLabel>
            </div>
            <div className='ml-8 mt-8 mr-8'>
                <CustomTable removeColumn={true} headers={['Nombre', 'Apellido', 'Usuario', 'Clave', 'Rol', 'Documento', 'Telefono', 'Activo']}
                    rows={rows.map(row => [
                        row.nombre,
                        row.apellido,
                        row.usuario,
                        row.clave,
                        row.rol,
                        row.documento,
                        row.telefono,
                        row.activo
                    ])}
                    ids={rows.map(row => row.id)}
                    confirmOnRemove={true}
                    onRemoveRow={handleRemoveUsuario}
                    onActivateRow={handleActivateUsuario}
                    onDeactivateRow={handleDeactivateUsuario}
                    >
                </CustomTable>
            </div>
            <ActionBar className='m-8' onConfirm={handleInsertUsuario}></ActionBar>
        </div>
    </div>
}

export default Productos 