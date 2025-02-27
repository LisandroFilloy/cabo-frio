// import VerticalNavBar from '@/components/custom/VerticalNavBar'
// import CustomTable from '@/components/custom/Table'
// import InputWithLabel from '../custom/InputWithLabel';
// import ActionBar from '../custom/ActionBar';
// import SelectWithLabel from '../custom/SelectWithLabel';
// import GridOfButtons from '@/components/custom/GridOfButtons'
// import SwitchWithLabel from '@/components/custom/SwitchWithLabel'

// const Combos = ({ }) => {

//     const rows = [
//         ["Electrónica", "Televisor", "$500.00", true],
//         ["Electrónica", "Laptop", "$1200.00", false],
//         ["Muebles", "Sofá", "$300.00", true],
//         ["Muebles", "Mesa", "$150.00", true],
//         ["Electrodomésticos", "Refrigerador", "$800.00", false],
//         ["Electrodomésticos", "Microondas", "$100.00", true],
//         ["Ropa", "Camisa", "$30.00", true],
//         ["Ropa", "Pantalones", "$40.00", false],
//         ["Juguetes", "Pelota", "$20.00", true],
//     ];

//     // const listOfProducts = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho']

//     return <div className='flex bg-gray-1 w-screen min-h-screen'>
//         <div className='w-64 hidden md:block'>
//             <VerticalNavBar active='combos' />
//         </div>
//         <div className='w-3/4 mx-auto'>
//             <div className='flex m-8 space-x-8'>
//                 <InputWithLabel label={'Nombre'}></InputWithLabel>
//                 <InputWithLabel label={'Precio'} ></InputWithLabel>
//                 {/* <SelectWithLabel label={'Rubro'}></SelectWithLabel> */}
//                 {/* <SwitchWithLabel label='Combo Activo'></SwitchWithLabel> */}
//             </div>
//             <div className='m-8 flex-1'>
//                 {/* <GridOfButtons width='w-auto' label='Selecciona productos' listOfProducts={listOfProducts}></GridOfButtons> */}
//             </div>
//             <div className='ml-8 mt-8 mr-8'>
//                 <CustomTable removeColumn={true} headers={['Rubro', 'Nombre', 'Precio', 'Activo']} rows={rows}>
//                 </CustomTable>
//             </div>
//             <ActionBar className='m-8'></ActionBar>
//         </div>
//     </div>
// }

// export default Combos 