// app/routes/authRoutes.js

const express = require('express');
const router = express.Router();
// Importamos el controlador de autenticación (que aún no creamos, pero lo referenciamos)
const authController = require('../controllers/authController'); 

// 1. Ruta para Registrar un nuevo usuario
// Método: POST porque estamos creando un nuevo recurso (usuario)
router.post('/register', authController.register);

// 2. Ruta para Iniciar Sesión de un usuario existente
// Método: POST porque se envían credenciales y se genera un token/sesión
router.post('/login', authController.login);

module.exports = router;