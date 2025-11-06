// app/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Cargar el .env (necesitamos la ruta correcta desde /app)
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Este es el "guardia de seguridad" (middleware).
 * Verifica el token enviado por el Front-end (api.js).
 */
module.exports = function(req, res, next) {
    
    // 1. Obtener el token del header 'Authorization'
    const authHeader = req.header('Authorization');

    // 2. Verificar si el header existe
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    // 3. Extraer el token (formato: "Bearer [token]")
    const token = authHeader.split(' ')[1]; // [0] = "Bearer", [1] = el token
    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    try {
        // 4. Verificar el token usando el secreto
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. ¡ÉXITO! El token es válido.
        // Adjuntamos el payload del usuario (que contiene el ID) al objeto 'req'
        // para que el siguiente controlador (ej. cartController) pueda usarlo.
        req.user = decoded.user;
        
        // 6. Continuar al siguiente paso (el controlador)
        next();

    } catch (err) {
        // 7. Si el token expiró o es inválido
        res.status(401).json({ message: 'Token no es válido o ha expirado.' });
    }
};