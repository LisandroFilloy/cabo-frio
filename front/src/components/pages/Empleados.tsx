import VerticalNavBar from '@/components/custom/VerticalNavBar'
import CustomTable from '@/components/custom/Table'
import InputWithLabel from '../custom/InputWithLabel';
import ActionBar from '../custom/ActionBar';

const Empleados = ({ }) => {

    const rows = [
        ["Juan", "Pérez", "12345678", "+1-555-1234", true],
        ["María", "García", "23456789", "+1-555-5678", false],
        ["Pedro", "Rodríguez", "34567890", "+1-555-8765", true],
        ["Ana", "López", "45678901", "+1-555-4321", true],
        ["Luis", "Fernández", "56789012", "+1-555-6789", false],
        ["Carla", "Martínez", "67890123", "+1-555-9876", true],
        ["Jorge", "Morales", "78901234", "+1-555-1357", false],
        ["Sofía", "Castro", "89012345", "+1-555-2468", true],
        ["Gabriel", "Díaz", "90123456", "+1-555-3698", false],
    ];


    return <div className='flex bg-gray-1 w-screen min-h-screen'>
        <div className='w-64 hidden md:block'>
            <VerticalNavBar active='empleados' />
        </div>
        <div className='w-3/4 mx-auto'>
            <div className='flex m-8 space-x-8'>
                <InputWithLabel label={'Nombre'}></InputWithLabel>
                <InputWithLabel label={'Apellido'} ></InputWithLabel>
                <InputWithLabel label={'Numero de doc.'}></InputWithLabel>
                <InputWithLabel label={'Teléfono'}></InputWithLabel>
            </div>
            <div className='ml-8 mt-8 mr-8'>
                <CustomTable removeColumn={true} headers={['Nombre', 'Apellido', 'Numero de doc.', 'Teléfono', 'Activo']} rows={rows} confirmOnRemove={true}>
                </CustomTable>
            </div>
            <ActionBar className='m-8'></ActionBar>
        </div>
    </div>
}

export default Empleados 