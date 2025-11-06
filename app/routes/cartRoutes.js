// app/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware'); // <-- 1. Importar el middleware

// 2. Aplicar el 'authMiddleware' a todas las rutas del carrito
// El middleware se ejecuta ANTES que el controlador

// 3. ¡CAMBIO DE RUTA! Ya no se usa /cart/:userId, ahora es solo /cart
router.get('/cart', authMiddleware, cartController.getCartItems);

router.post('/cart/add', authMiddleware, cartController.addItemToCart);

router.delete('/cart/remove/:itemId', authMiddleware, cartController.removeItemFromCart);

router.post('/checkout', authMiddleware, cartController.processCheckout);

module.exports = router;