// app/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController'); 

// 1. Ruta para obtener la lista completa de camisetas (Catálogo - index.html)
// Método: GET para obtener recursos (sin modificar nada)
router.get('/products', productsController.getAllProducts);

// 2. Ruta para obtener el detalle de una camiseta específica (product.html)
// Método: GET para obtener un recurso específico
// :id es un parámetro que se pasa en la URL (ej. /api/products/45)
router.get('/products/:id', productsController.getProductById);

// [OPCIONAL] Ruta para crear un nuevo producto (solo para el administrador, si se necesita)
// router.post('/products', productsController.createProduct);

module.exports = router;