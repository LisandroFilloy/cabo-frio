const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, nombre, precio_pesos, codigo, costo_pesos, cantidad, rubro, stock, isUpdate } = req.body;

        // Si es una actualización, buscamos si ya existe un producto con el mismo código
        if (isUpdate) {
            const checkQuery = `
                SELECT id FROM productos WHERE codigo = $1 AND local = $2;
            `;
            const checkResult = await pool.query(checkQuery, [codigo, local]);

            if (checkResult.rows.length === 0) {
                // Si no existe, respondemos con error
                return res.status(400).json({ error: 'El producto con ese código no existe para este local.' });
            }

            // Si el producto existe, actualizamos
            const updateQuery = `
                UPDATE productos
                SET nombre = $2, precio_pesos = $3, costo_pesos = $4, cantidad = $5, rubro = $6, stock = $7
                WHERE codigo = $1 AND local = $8
                RETURNING id;
            `;
            const updateResult = await pool.query(updateQuery, [codigo, nombre, precio_pesos, costo_pesos, cantidad, rubro, stock, local]);
            const { id } = updateResult.rows[0];

            return res.status(200).json({ id, message: 'Producto actualizado con éxito' });
        } else {
            // Si no es una actualización, verificamos si el producto con el código ya existe
            const checkQuery = `
                SELECT id FROM productos WHERE codigo = $1 AND local = $2;
            `;
            const checkResult = await pool.query(checkQuery, [codigo, local]);

            if (checkResult.rows.length > 0) {
                // Si el producto ya existe, respondemos con error
                return res.status(400).json({ error: 'El código del producto ya existe en este local.' });
            } else {
                // Si no existe, insertamos el nuevo producto
                const insertQuery = `
                    INSERT INTO productos (local, nombre, precio_pesos, codigo, costo_pesos, cantidad, rubro, stock)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id;
                `;
                const insertResult = await pool.query(insertQuery, [local, nombre, precio_pesos, codigo, costo_pesos, cantidad, rubro, stock]);
                const { id } = insertResult.rows[0];

                return res.status(201).json({ id, message: 'Producto ingresado con éxito' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al insertar o actualizar el producto en la base de datos.' });
    }
});

module.exports = router;
