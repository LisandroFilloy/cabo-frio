import VerticalNavBar from '@/components/custom/VerticalNavBar'
import CustomTable from '@/components/custom/Table'
import InputWithLabel from '../custom/InputWithLabel'
import ActionBar from '../custom/ActionBar'


const Locales = ({ }) => {

    const rows = [
        ["La Tienda Feliz", "2023-01-15", true],
        ["Supermercado Central", "2022-11-08", false],
        ["Panadería El Trigo", "2023-03-20", true],
        ["Electrónica Total", "2022-07-30", true],
        ["Librería La Pluma", "2023-05-25", false],
    ];

    return <div className='flex bg-gray-1 w-screen min-h-screen'>
        <div className='w-64 hidden md:block'>
            <VerticalNavBar active='locales' />
        </div>
        <div className='w-3/4 mx-auto'>
            <div className='m-8'>
                <InputWithLabel label='Nombre'></InputWithLabel>
            </div>
            <div className='m-8'>
                <CustomTable headers={['Nombre', 'Fecha de creacion', 'Activo']} rows={rows}>
                </CustomTable>
            </div>
            <ActionBar className='m-8'></ActionBar>
        </div>
    </div>
}

export default Locales 