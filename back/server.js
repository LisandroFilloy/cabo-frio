const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
const port = 3003;
const JWT_SECRET = '12345678';
// In-memory cache for storing the value of dolar Blue
let cachedDolarBluePromedio = null;

// Create a new pool instance with your database configuration
const pool = new Pool({
    host: 'localhost',
    username: 'licha',
    password: 'password',
    database: 'cabo-frio',
    port: 5432, // Default PostgreSQL port
});

// Function to fetch the latest value and update the cache
const fetchAndCacheDolarBluePromedio = async () => {
    try {
        const response = await axios.get('https://dolarapi.com/v1/dolares/blue');
        const valor_compra = response.data.compra;
        const valor_venta = response.data.venta;
        const valor_promedio = (valor_compra + valor_venta) / 2;
        cachedDolarBluePromedio = valor_promedio;
    } catch (error) {
        console.error('Error fetching or caching Dolar Blue Promedio:', error);
    }
};

// Fetch initial value on startup
fetchAndCacheDolarBluePromedio();

function getDolarBlueValue() {
    return cachedDolarBluePromedio;
}

module.exports = { pool, getDolarBlueValue };

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Middleware to set Referrer-Policy
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer'); // or 'unsafe-url'
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Initial endpoint for testing server
app.get('/', (req, res) => {
    res.json({ 'Hello': 'Human' });
});

// Real endpoints

// Authentication
app.use('/api/login', require('./routes/login'));
app.use('/api/check-auth', require('./routes/checkAuth'));

// Ventas
app.use('/api/ventas/insert', require('./routes/insertSale'));
app.use('/api/ventas/get', require('./routes/getDailySales'));
app.use('/api/ventas/remove', require('./routes/removeSale'));
app.use('/api/ventas/get/filtered', require('./routes/getFilteredSales'));
app.use('/api/ventas/get/filteredBalance', require('./routes/getFilteredSalesBalance'));

// Caja
app.use('/api/caja/update-status', require('./routes/updateCashRegisterStatus'));
app.use('/api/caja/get-status', require('./routes/getCashRegisterStatus'));
app.use('/api/caja/get-monto', require('./routes/getMontoCaja'));
app.use('/api/caja/get-valores-ticket', require('./routes/getValoresTicket'));
app.use('/api/caja/insert-correcion', require('./routes/insertCorreccion'));

// Egresos
app.use('/api/egresos/insert', require('./routes/insertEgreso'));
app.use('/api/egresos/get', require('./routes/getEgresos'));
app.use('/api/egresos/get/by-dates', require('./routes/getEgresosByDates'));
app.use('/api/egresos/get/pendientes', require('./routes/getPendientes'));
app.use('/api/egresos/remove', require('./routes/removeEgreso'));
app.use('/api/egresos/ejecutar', require('./routes/ejecutarEgresoPendiente'));
app.use('/api/egresos/get/totales-por-rubro', require('./routes/getEgresosTotalesPorRubro'));

// Productos
app.use('/api/productos/get', require('./routes/getProducts'));
app.use('/api/productos/insert', require('./routes/insertProduct'));
app.use('/api/productos/remove', require('./routes/removeProducto'));
app.use('/api/productos/deactivate', require('./routes/deactivateProducto'));
app.use('/api/productos/activate', require('./routes/activateProducto'));

// Proveedores
app.use('/api/proveedores/insert', require('./routes/insertProveedor'));
app.use('/api/proveedores/get', require('./routes/getProveedores'));
app.use('/api/proveedores/remove', require('./routes/removeProveedor'));
app.use('/api/proveedores/deactivate', require('./routes/deactivateProveedor'));
app.use('/api/proveedores/activate', require('./routes/activateProveedor'));

// Usuarios 
app.use('/api/usuarios/create', require('./routes/insertUsuario'));
app.use('/api/usuarios/get', require('./routes/getUsuarios'));
app.use('/api/usuarios/remove', require('./routes/removeUsuarios'));
app.use('/api/usuarios/deactivate', require('./routes/deactivateUsuario'));
app.use('/api/usuarios/activate', require('./routes/activateUsuario'));

// Empleados
app.use('/api/empleados/get', require('./routes/getEmpleados'));
app.use('/api/empleados/add', require('./routes/addEmpleado'));
app.use('/api/empleados/remove', require('./routes/removeEmpleado'));
app.use('/api/empleados/deactivate', require('./routes/deactivateEmpleado'));
app.use('/api/empleados/activate', require('./routes/activateEmpleado'));

// Balance
app.use('/api/balance', require('./routes/balance'));

// Fetch Local 
app.use('/api/local/get', require('./routes/fetchLocal'));

// Stock 
app.use('/api/stock/insert', require('./routes/insertStock'));
app.use('/api/stock/remove', require('./routes/removeStock'));
app.use('/api/stock/get', require('./routes/getStock'));
app.use('/api/stock/create', require('./routes/createStock'));
app.use('/api/stock/agregarValor', require('./routes/agregarValorStock'));
app.use('/api/stock/get-last-movements', require('./routes/getStockLastMovements'));

// Email 

app.use('/api/send-email', require('./routes/sendEmail'));
