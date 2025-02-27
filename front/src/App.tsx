import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '@/components/pages/Auth';
// import Testing from '@/components/custom/Testing'
import Ventas from '@/components/pages/Ventas'
// import Clientes from '@/components/pages/Clientes'
import Caja from '@/components/pages/Caja'
import Egresos from '@/components/pages/Egresos'
import Productos from '@/components/pages/Productos'
import Proveedores from '@/components/pages/Proveedores'
import Usuarios from '@/components/pages/Usuarios'
// import Combos from '@/components/pages/Combos'
import Stock from '@/components/pages/Stock'
import Venta from '@/components/pages/Venta'
import Balance from '@/components/pages/Balance'
// import Locales from '@/components/pages/Locales'
import { RedirectEmployees } from '@/components/contexts/role-context'
import AuthenticatedRoute from '@/components/contexts/auth-context'
import { CheckIfCashRegisterOpen } from '@/components/contexts/role-context'
import { ProductsProvider } from '@/components/contexts/products-context'
import Egreso from './components/pages/Egreso';
// Import other components as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Ventas/nueva-venta" element={
          <AuthenticatedRoute>
            <ProductsProvider>
              <CheckIfCashRegisterOpen>
                <Ventas page_window={'nueva-venta'} />
              </CheckIfCashRegisterOpen>
            </ProductsProvider>
          </AuthenticatedRoute>
        } />
        <Route path="/Ventas/ventas-del-dia" element={
          <AuthenticatedRoute>
            <ProductsProvider>
              <Ventas page_window={'ventas-del-dia'} />
            </ProductsProvider>
          </AuthenticatedRoute>
        } />
        <Route path="/caja" element={
          <AuthenticatedRoute>
            <Caja />
          </AuthenticatedRoute>
        } />
        <Route path="/egresos" element={
          <AuthenticatedRoute>
            <CheckIfCashRegisterOpen>
              <Egresos />
            </CheckIfCashRegisterOpen>
          </AuthenticatedRoute>
        } />
        <Route path="/productos" element={
          <AuthenticatedRoute>
            <ProductsProvider>
              <RedirectEmployees>
                <Productos />
              </RedirectEmployees>
            </ProductsProvider>
          </AuthenticatedRoute>
        } />
        <Route path="/proveedores" element={
          <CheckIfCashRegisterOpen>
            <AuthenticatedRoute>
                <Proveedores />
            </AuthenticatedRoute>
          </CheckIfCashRegisterOpen>
        } />
        <Route path="/usuarios" element={
          <AuthenticatedRoute>
            <RedirectEmployees>
              <Usuarios />
            </RedirectEmployees>
          </AuthenticatedRoute>
        } />
        <Route path="/stock/modificar-stock" element={
          <AuthenticatedRoute>
            <CheckIfCashRegisterOpen>
              <Stock page_window={'modificar-stock'} />
            </CheckIfCashRegisterOpen>
          </AuthenticatedRoute>
        } />
        <Route path="/stock/nuevo-stock" element={
          <AuthenticatedRoute>
            <CheckIfCashRegisterOpen>
              <Stock page_window='nuevo-stock'/>
            </CheckIfCashRegisterOpen>
          </AuthenticatedRoute>
        } />
        <Route path="/stock/ultimos-movimientos" element={
          <AuthenticatedRoute>
            <CheckIfCashRegisterOpen>
              <Stock page_window='ultimos-movimientos'/>
            </CheckIfCashRegisterOpen>
          </AuthenticatedRoute>
        } />
        <Route path="/venta" element={
          <AuthenticatedRoute>
            <ProductsProvider>
              <RedirectEmployees>
                <Venta />
              </RedirectEmployees>
            </ProductsProvider>
          </AuthenticatedRoute>
        } />
        <Route path="/balance" element={
          <AuthenticatedRoute>
            <RedirectEmployees>
              <Balance />
            </RedirectEmployees>
          </AuthenticatedRoute>
        } />
        <Route path="/egreso" element={
          <AuthenticatedRoute>
            <RedirectEmployees>
              <Egreso />
            </RedirectEmployees>
          </AuthenticatedRoute>
        } />
        {/* <Route path="/testing" element={<Testing />} /> */}
        <Route path="*" element={<Navigate to="/caja" replace />} /> TODO: Redirigir a locales si ya está autenticado
      </Routes>
    </Router>
  );
}

export default App;
