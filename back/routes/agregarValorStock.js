const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, codigo, cantidad } = req.body;

        // First, select the product data
        const productQuery = `
            SELECT cantidad AS producto_cantidad, stock as producto_stock
            FROM productos
            WHERE codigo = $1
            AND eliminado = false
        `;
        const productResult = await pool.query(productQuery, [codigo]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found or deleted.' });
        }

        const productoCantidad = productResult.rows[0].producto_cantidad;
        const productoStock = productResult.rows[0].producto_stock;

        // Try updating the stock first
        const updateQuery = `
            UPDATE stock_valores
            SET cantidad = $3::numeric * $4 + cantidad::numeric
            WHERE local = $1
            AND nombre = $2
        `;
        const updateResult = await pool.query(updateQuery, [local, productoStock, productoCantidad, cantidad]);

        if (updateResult.rowCount > 0) {
            // If rows were updated, send success response
            return res.status(200).json({ message: 'Stock updated successfully.' });
        }

        // If no rows were updated, insert a new stock record
        const insertQuery = `
            INSERT INTO stock_valores (local, nombre, cantidad)
            VALUES ($1, $2, $3)
        `;

        const codigo_sin_stock = codigo + '_sin_stock'
        await pool.query(insertQuery, [local, codigo_sin_stock, productoCantidad * cantidad]);

        res.status(200).json({ message: 'Stock created successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar valor al stock' });
    }
});

module.exports = router;
