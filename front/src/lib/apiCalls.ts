import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api';

// Login 

export const CheckAuth =  async () => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_BASE_URL}/check-auth`);
        return response;
    } catch (error) {
        console.error("Wrong credentials", error);
    }
};

export const Login = async (usuario: string, clave: string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/login`, {
            usuario,
            clave
        });
        return response;
    } catch (error) {
        console.error("Wrong credencials", error);
    }
};


// Ventas


interface SaleDetails {
    nombre: string;
    total_pesos: number;
    productos: Record<string, any>; // Adjusted to reflect a JSON object structure
    direccion: string;
    medio_de_pago: string;
    tipo_venta: string;
    local: string
}

export const insertSale = async (saleDetails: SaleDetails) => {
    try {
        const { local, nombre, total_pesos, productos, direccion, medio_de_pago, tipo_venta } = saleDetails;
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/ventas/insert`, {
            local,
            nombre,
            total_pesos,
            productos, // Make sure this is structured as a JSON object
            direccion,
            medio_de_pago,
            tipo_venta
        });
        return response;
    } catch (error) {
        console.error("Error inserting sale:", error);
        alert("Fallo la carga de la venta.");
    }
};

export const getSales12h = async (local: string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/ventas/get`, {
            local
        });
        return response;
    } catch (error) {
        console.error("Error retrieving sales:", error);
        alert("Fallo la obtencion de ventas del dia.");
    }
};

export const removeSale = async (id: number, local:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/ventas/remove`, {
            id,
            local
        });
        return response;
    } catch (error) {
        console.error("Error removing sale", error);
        alert("Fallo la app al intentar remover la venta.");
    }
}

// Caja

export const getStatusCaja = async (local: string) => {

    try {
        const token = Cookies.get('auth_token');
        if (!token){
            return
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/caja/get-status`, { local });
        return response.data; // Assuming your server returns the data in the response body
    } catch (error) {
        console.error("Error fetching status:", error);
        alert("Fallo al obtener el estado de la acción.");
    }
};

interface updateCajaProps {
    local:string,
    user: string,
    accion: string
}

export const updateStatusCaja = async (updateCajaProps: updateCajaProps) => {
    const { local, user, accion } = updateCajaProps;
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/caja/update-status`, { local, user, accion });
        return response.data; // Assuming your server returns the data in the response body
    } catch (error) {
        console.error('Error updating cash register status:', error);
        alert("Fallo al actualizar la caja");
    }
};

export const getMontoCaja = async (local:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/caja/get-monto`, { local });
        return response.data; // Assuming your server returns the data in the response body
    } catch (error) {
        console.error('Error al obtener el monto de la caja:', error);
        alert("Fallo al obtener el monto de la caja");
    }
};

export const getValoresTicket = async (local:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/caja/get-valores-ticket`, { local });
        return response.data; // Assuming your server returns the data in the response body
    } catch (error) {
        console.error('Error al obtener el monto de la caja:', error);
        alert("Fallo al obtener el monto de la caja");
    }
};

export const insertCorreccionCaja = async (local:string, cantidad:number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/caja/insert-correcion`, { local, cantidad });
        return response.data; // Assuming your server returns the data in the response body
    } catch (error) {
        console.error('Error al insertar corrección de caja:', error);
        alert("Fallo al insertar corrección de caja.");
    }
};

// Egresos

interface EgresoProps {
    local:string,
    fecha_inicio:string,
    fecha_fin:string
}

export const insertEgreso = async (local: string, monto: number, rubro: string, descripcion: string, pendiente:boolean) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/egresos/insert`, { local, monto, rubro, descripcion, pendiente });
        return response.data; // Assuming your server returns the data in the response body
    } catch (error) {
        console.error("Error inserting egreso", error);
        alert("Fallo al insertar ingreso.");
    }
};

export const getEgresos = async (local: string, user:string) => {
    try {
        const token = Cookies.get('auth_token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/egresos/get`, { local, user });
        return response.data
    } catch (error) {
        console.error("Error fetching egresos", error);
        alert("Fallo al obtener egresos")
    }
};

export const getPendientes = async (local: string) => {
    try {
        const token = Cookies.get('auth_token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/egresos/get/pendientes`, { local });
        return response.data
    } catch (error) {
        console.error("Error fetching egresos", error);
        alert("Fallo al obtener egresos")
    }
};

export const getEgreso = async (egresoProps: EgresoProps) => {
    try {
        const token = Cookies.get('auth_token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/egresos/get/by-dates`, egresoProps);
        return response.data
    } catch (error) {
        console.error("Error fetching egresos", error);
        alert("Fallo al obtener egresos")
    }
};

export const getEgresosTotalesPorRubro = async (egresoProps: EgresoProps) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/egresos/get/totales-por-rubro`, egresoProps);
        return response.data;
    } catch (error) {
        console.error("Error fetching totals by rubro", error);
        alert("Fallo al obtener los totales por rubro");
    }
};



export const removeEgreso = async (id: number) => {
    try {
        const token = Cookies.get('auth_token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/egresos/remove`, { id });
        return response.data
    } catch (error) {
        console.error("Error fetching egresos", error);
        alert("Fallo al obtener egresos")
    }
};

export const ejecutarEgreso = async (local: string, monto: number, rubro: string, descripcion: string, pendiente:boolean, id: number) => {
    try {
        const token = Cookies.get('auth_token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/egresos/ejecutar`, { local, monto, rubro, descripcion, pendiente, id });
        return response.data
    } catch (error) {
        console.error("Error fetching egresos", error);
        alert("Fallo al obtener egresos")
    }
};

// Productos

interface insertProductParams {
    local: string, nombre: string, precio_pesos: number, codigo: string, costo_pesos: number, cantidad: number, rubro: string, stock?:string
  }

export const insertProducto = async (insertProduct: insertProductParams) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/productos/insert`, insertProduct);
        alert("Producto ingresado/actualizado con exito!")
        return response.data; // Assuming your server returns the inserted product id
    } catch (error) {
        console.error("Error inserting/updating product:", error);
        alert("Fallo al insertar/actualizar el producto.");
    }
};

export const getProductos = async (local: string) => {

    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/productos/get`, { local });
        return response;
    } catch (error) {
        console.error(error)
        alert("Fallo la búsqueda de productos.")
    }
};

export const removeProducto = async (id: number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/productos/remove`, { id });
        alert('Producto eliminado.');
        return response.data; // Assuming your server returns the removed product id
    } catch (error) {
        console.error("Error removing product:", error);
        alert("Fallo al eliminar el producto.");
    }
};

export const deactivateProducto = async (id: number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/productos/deactivate`, { id });
        return response.data; // Assuming your server returns the deactivated product id
    } catch (error) {
        console.error("Error deactivating product:", error);
        alert("Fallo al desactivar el producto.");
    }
};


export const activateProducto = async (id: number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/productos/activate`, { id });
        return response.data; // Assuming your server returns the activated product id
    } catch (error) {
        console.error("Error activating product:", error);
        alert("Fallo al activar el producto.");
    }
};

// Proveedores 

interface Proveedor {
    id?: number;
    local: string;
    nombre: string;
    telefono: string;
    email: string;
    rubro: string;
    activo?: boolean;
}

export const insertProveedor = async (proveedor: Proveedor): Promise<number | undefined> => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/proveedores/insert`, proveedor);
        return response.data.id;
    } catch (error) {
        console.error("Error inserting proveedor:", error);
        alert("Fallo la inserción del proveedor.");
    }
};

export const getProveedores = async (local: string): Promise<Proveedor[] | undefined> => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/proveedores/get`, { local });
        return response.data;
    } catch (error) {
        console.error("Error fetching proveedores:", error);
        alert("Fallo la obtención de proveedores.");
    }
};

export const removeProveedor = async (id: number): Promise<number | undefined> => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/proveedores/remove`, { id });
        return response.data.id;
    } catch (error) {
        console.error("Error removing proveedor:", error);
        alert("Fallo al eliminar el proveedor.");
    }
};

export const deactivateProveedor = async (id: number): Promise<number | undefined> => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/proveedores/deactivate`, { id });
        return response.data.id;
    } catch (error) {
        console.error("Error deactivating proveedor:", error);
        alert("Fallo al desactivar el proveedor.");
    }
};

export const activateProveedor = async (id: number): Promise<number | undefined> => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/proveedores/activate`, { id });
        return response.data.id;
    } catch (error) {
        console.error("Error activating proveedor:", error);
        alert("Fallo al activar el proveedor.");
    }
};


// Usuarios 

export interface UsuarioDetails {
    local: string;
    usuario: string;
    clave: string;
    rol: string;
    nombre: string,
    apellido: string,
    telefono: string,
    documento: string
}

export const insertUsuario = async (usuarioDetails: UsuarioDetails) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/usuarios/create`, usuarioDetails);
        return response.data.id; // Assuming the server returns the created user ID
    } catch (error) {
        console.error("Error creating user:", error);
        alert("Fallo la creación del usuario.");
    }
};

export const getUsuarios = async (local: string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/usuarios/get`, { local });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Fallo la obtención de usuarios.");
    }
};

export const removeUsuario = async (id: number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/usuarios/remove`, { id });
        return response.data.message; // Assuming the server returns a success message
    } catch (error) {
        console.error("Error removing user:", error);
        alert("Fallo al eliminar el usuario.");
    }
};

export const deactivateUsuario = async (id: number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/usuarios/deactivate`, { id });
        return response.data.message; // Assuming the server returns a success message
    } catch (error) {
        console.error("Error deactivating user:", error);
        alert("Fallo al desactivar el usuario.");
    }
};

export const activateUsuario = async (id: number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/usuarios/activate`, { id });
        return response.data.message; // Assuming the server returns a success message
    } catch (error) {
        console.error("Error activating user:", error);
        alert("Fallo al activar el usuario.");
    }
};


// Venta

interface filteredVentas{
    local:string,
    rubro:string,
    producto:string,
    tipo_venta:string, 
    medio_de_pago:string, 
    fecha_inicio:string, 
    fecha_fin:string
}

export const getFilteredVentas = async (filteredVentasProps: filteredVentas) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/ventas/get/filtered`, filteredVentasProps);
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered sales:", error);
        alert("Fallo la obtención ventas filtradas");
    }
};

export const getFilteredVentasBalance = async (filteredVentasProps: filteredVentas) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/ventas/get/filteredBalance`, filteredVentasProps);
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered sales:", error);
        alert("Fallo la obtención ventas filtradas");
    }
};


// Balance

interface BalanceProps {
    fecha_inicio:string,
    fecha_fin:string,
    local:string
}

export const getBalance = async (balanceProps: BalanceProps) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/balance`, balanceProps);
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered sales:", error);
        alert("Fallo la obtención ventas filtradas");
    }
};

// Fetch local from user
export const fetchLocal = async (usuario: string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/local/get`, {usuario});
        return response.data.local;
    } catch (error) {
        console.error("Error fetching filtered sales:", error);
        alert("Fallo la obtención ventas filtradas");
    }
};


// Stock 

interface insertStockProps{
    local:string,
    nombre:string,
    cantidad:Number,
    tipo:string,
    agregar:boolean
}

export const insertStock = async (insertStock:insertStockProps) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/stock/insert`, insertStock);
        return response.data.local;
    } catch (error) {
        console.error("Error fetching filtered sales:", error);
        alert("Fallo al insertar stock");
    }
};

export const getStock = async (local:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/stock/get`, {local});
        return response.data
    } catch (error) {
        console.error("Error fetching stock:", error);
        alert("Fallo la obtencion de stocks");
    }
};


export const getStockLastMovements = async (local:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/stock/get-last-movements`, {local});
        return response.data.result.rows;
    } catch (error) {
        console.error("Error fetching stock last movements:", error);
        alert("fallo la obtencion de los ultimos movimientos en el stock");
    }
};

export const removeStock = async (local:string, nombre:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/stock/remove`, {local, nombre});
        return response.data.local;
    } catch (error) {
        console.error("Error removing stock element:", error);
        alert("Fallo la eliminacion de un elemento del stock");
    }
};

export const crearStock = async (local:string, nombre:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/stock/create`, {local, nombre});
        return response.data.local;
    } catch (error) {
        console.error("Error creando stock:", error);
        alert("Fallo la creación del stock.");
    }
};

export const agregarStockValores = async (local:string, codigo:string, cantidad:number) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/stock/agregarValor`, {local, codigo, cantidad});
        return response.data.local;
    } catch (error) {
        console.error("Error descontando del stock:", error);
        alert("Error al descontar del stock.");
    }
};

// Email 

export const sendEmail = async (subject:string, receiver:string, text:string) => {
    try {
        const token = Cookies.get('auth_token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_BASE_URL}/send-email`, {subject, receiver, text});
        return response.data.local;
    } catch (error) {
        console.error("Error descontando del stock:", error);
        alert("Error al descontar del stock.");
    }
};