const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart - Obtener los items del carrito del usuario
router.get('/cart', cartController.getCart);

// POST /api/cart/add - Añadir un producto al carrito
router.post('/cart/add', cartController.addToCart);

// DELETE /api/cart/item/:itemId - Eliminar un item del carrito
router.delete('/cart/item/:itemId', cartController.removeFromCart);

router.get('/history', cartController.getHistory);

module.exports = router;