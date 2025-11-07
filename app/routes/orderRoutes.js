// app/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Definimos la nueva ruta para el historial
router.get('/orders', authMiddleware, orderController.getOrderHistory);

module.exports = router;