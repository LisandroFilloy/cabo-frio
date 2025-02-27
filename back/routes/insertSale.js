const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool, getDolarBlueValue } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { local, nombre, total_pesos, productos, direccion, medio_de_pago, tipo_venta } = req.body;
    const username = req.user.username; // Extract 'username' from JWT payload
    
    // Check if cachedDolarBluePromedio is available
    const cachedDolarBluePromedio = getDolarBlueValue();
    if (cachedDolarBluePromedio === null) {
      return res.status(500).json({ error: 'Cached Dolar Blue Promedio value not available' });
    }

    const total_usd = (total_pesos / cachedDolarBluePromedio).toFixed(2);

    // Update productos with precio_usd and costo_usd rounded to 2 decimal places
    const updatedProductos = {};
    for (const [productCode, details] of Object.entries(productos)) {
      updatedProductos[productCode] = {
        ...details,
        precio_usd: Number((details.precio_pesos / cachedDolarBluePromedio).toFixed(2)),
        costo_usd: Number((details.costo_pesos / cachedDolarBluePromedio).toFixed(2)),
      };
    }

    const query = `
      INSERT INTO ventas (local, nombre, total_pesos, total_usd, productos, direccion, medio_de_pago, tipo_venta, usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;
    
    const result = await pool.query(query, [local, nombre, total_pesos, total_usd, JSON.stringify(updatedProductos), direccion, medio_de_pago, tipo_venta, username]);

    const { id } = result.rows[0];

    res.status(201).json({ id: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la venta en la base de datos.' });
  }
});

module.exports = router;
