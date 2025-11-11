const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/auth'); // <-- 1. IMPORTAR AQUÍ

// POST /api/payment/create-preference (protegida)
router.post('/payment/create-preference', isAuthenticated, paymentController.createPreference); // <-- 2. AÑADIR AQUÍ

// POST /api/payment/webhook (pública, SIN auth)
router.post('/payment/webhook', paymentController.receiveWebhook);

module.exports = router;