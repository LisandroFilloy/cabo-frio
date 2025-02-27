const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { id, local } = req.body;

        // Primero, marcamos la venta como eliminada
        const updateQuery = `
            UPDATE ventas
            SET eliminada = true
            WHERE id = $1
            RETURNING id, productos;
        `;
        
        const result = await pool.query(updateQuery, [id]);

        // Si no se encontró la venta, devolvemos un error
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Venta no encontrada.' });
        }

        // Obtenemos el JSON de productos de la venta
        const productos = result.rows[0].productos;

        // Recorremos los productos y actualizamos el stock en stock_valores
        for (const [nombreProducto, dataProducto] of Object.entries(productos)) {
            const cantidadRestaurar = dataProducto.cantidad *  dataProducto.peso_gramos;

            // Obtenemos el valor de "stock" desde la tabla productos para el producto actual
            const stockQuery = `
                SELECT stock 
                FROM productos 
                WHERE nombre = $1 
                AND local = $2 
                AND eliminado = false
                LIMIT 1;
            `;
            const stockResult = await pool.query(stockQuery, [nombreProducto, local]);

            // Si no se encontró el producto en la tabla productos, se omite la actualización
            if (stockResult.rowCount === 0 || !stockResult.rows[0].stock) {
                console.warn(`No se encontró el stock para el producto: ${nombreProducto}`);
                continue;
            }

            const nombreStock = stockResult.rows[0].stock;

            // Actualizamos la cantidad en stock_valores utilizando el nombre de stock obtenido
            const updateStockQuery = `
                UPDATE stock_valores
                SET cantidad = cantidad - $1
                WHERE nombre = $2
                AND local = $3;
            `;

            await pool.query(updateStockQuery, [cantidadRestaurar, nombreStock, local]);
        }

        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la venta y restaurar el stock en la base de datos.' });
    }
});

module.exports = router;
