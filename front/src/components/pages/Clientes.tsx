import VerticalNavBar from '@/components/custom/VerticalNavBar'
import CustomTable from '@/components/custom/Table'
import InputWithLabel from '../custom/InputWithLabel';
import ActionBar from '../custom/ActionBar';


const Clientes = ({ }) => {

    const rows = [
        ["John Doe", "john.doe@example.com", "+1-555-1234", "123 Elm Street, Springfield"],
        ["Jane Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Avenue, Metropolis"],
        ["Alice Johnson", "alice.johnson@example.com", "+1-555-8765", "789 Pine Road, Gotham"],
        ["Bob Brown", "bob.brown@example.com", "+1-555-4321", "321 Maple Street, Smalltown"],
        ["Charlie Davis", "charlie.davis@example.com", "+1-555-6789", "654 Birch Lane, Rivertown"],
        ["Diana Prince", "diana.prince@example.com", "+1-555-9876", "987 Cedar Boulevard, Star City"],
        ["Edward Lewis", "edward.lewis@example.com", "+1-555-1357", "159 Spruce Drive, Hill Valley"],
        ["Fiona Green", "fiona.green@example.com", "+1-555-2468", "753 Redwood Street, Lakeside"],
        ["George King", "george.king@example.com", "+1-555-3698", "852 Fir Avenue, Brooksville"],
    ];


    return <div className='flex bg-gray-1 w-screen min-h-screen'>
        <div className='w-64 hidden md:block'>
            <VerticalNavBar active='clientes' />
        </div>
        <div className='w-3/4 mx-auto'>
            <div className='grid md:w-7/12 lg:w-auto md:grid-cols-1 lg:grid-cols-3 xl:flex m-8 gap-8'>
                <InputWithLabel label={'Nombre'}></InputWithLabel>
                <InputWithLabel label={'Telefono'}></InputWithLabel>
                <InputWithLabel label={'Email'}></InputWithLabel>
                <InputWithLabel className='w-96' label={'Dirección'}></InputWithLabel>
            </div>
            <div className='ml-8 mt-8 mr-8'>
                <CustomTable removeColumn={true} headers={['Nombre', 'Email', 'Telefono', 'Direccion']} rows={rows}>
                </CustomTable>
            </div>
            <ActionBar className='m-8'></ActionBar>
        </div>
    </div>
}

export default Clientes 