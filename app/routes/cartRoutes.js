// app/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// const authMiddleware = require('../middleware/authMiddleware'); // Se usaría aquí

// NOTA: Idealmente, todas las rutas de carrito estarían protegidas por authMiddleware
// para asegurar que solo los usuarios logueados puedan modificarlas.

// 1. Ruta para obtener los ítems del carrito de un usuario
// Método: GET para obtener recursos
router.get('/cart/:userId', cartController.getCartItems);

// 2. Ruta para añadir un producto al carrito
// Método: POST para crear un nuevo ítem en la tabla CartItem
router.post('/cart/add', cartController.addItemToCart);

// 3. Ruta para eliminar un ítem del carrito
// Método: DELETE para eliminar un recurso
router.delete('/cart/remove/:itemId', cartController.removeItemFromCart);

// 4. Ruta para procesar la compra (Simulación de Proceso de Pago - checkout.html)
// Método: POST para enviar la solicitud de pago y crear el recurso "Orden"
router.post('/checkout', cartController.processCheckout);

module.exports = router;