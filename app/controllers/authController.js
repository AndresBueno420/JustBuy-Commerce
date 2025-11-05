// app/controllers/authController.js

const path = require('path');
const User = require('../models/userModel'); // Importa el modelo de Usuario
const bcrypt = require('bcryptjs');          // Importa librería para hashear contraseñas
const jwt = require('jsonwebtoken');       // Importa librería para crear JSON Web Tokens (JWT)
const dotenv = require('dotenv');          // Necesario para leer el secreto del JWT

dotenv.config({ path: path.join(__dirname, '../.env') });

exports.register = async (req, res) => {
    
    try {
        // 1. Obtener datos del Front-end (register.html)
        const { email, username, password } = req.body;

        // 2. Validar que los datos estén completos
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Por favor, completa todos los campos." });
        }

        // 3. Verificar si el usuario o email ya existen en RDS
        const existingUser = await User.findOne({ 
            where: {
                [Op.or]: [{ email: email }, { username: username }] 
            }
        });
        
        if (existingUser) {
            return res.status(409).json({ message: "El correo electrónico o el nombre de usuario ya están registrados." });
        }

        // 4. Hashear la Contraseña (¡CRÍTICO!)
        // 'salt' es un valor aleatorio que se añade para hacer el hash único
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Crear el usuario en la base de datos (RDS)
        const newUser = await User.create({
            email: email,
            username: username,
            password: hashedPassword // Guardamos el hash, no la contraseña original
        });

        // 6. Enviar respuesta de éxito
        res.status(201).json({
            message: "Usuario registrado exitosamente.",
            userId: newUser.id
        });

    } catch (error) {
        // 7. Manejo de errores
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

exports.login = async (req, res) => {
    
    try {
        // 1. Obtener credenciales del Front-end (login.html)
        // Usamos 'username' pero podría ser el email también
        const { username, password } = req.body;

        // 2. Buscar al usuario en la DB (RDS)
        const user = await User.findOne({ where: { username: username } });

        // 3. Si el usuario no existe, enviar error
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // 4. Comparar la contraseña enviada con el hash guardado en RDS
        const isMatch = await bcrypt.compare(password, user.password);

        // 5. Si la contraseña no coincide, enviar error
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas." }); // 401 = No Autorizado
        }

        // 6. CREAR EL TOKEN JWT (El "Pasaporte" de Sesión)
        // Creamos un 'payload' con datos que queremos guardar en el token
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        // Firmamos el token con un secreto (¡debe estar en .env!)
        // El token expira en 1 hora (puedes cambiarlo)
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Debes añadir JWT_SECRET="tu_frase_secreta" a tu .env
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                
                // 7. Enviar el Token al Front-end
                // El Front-end (jQuery) deberá guardar este token (ej. en localStorage)
                // y enviarlo en las cabeceras de futuras peticiones (ej. /api/cart/add)
                res.status(200).json({
                    message: "Inicio de sesión exitoso.",
                    token: token
                });
            }
        );

    } catch (error) {
        // 8. Manejo de errores
        console.error("Error en el login:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

// (Necesitas importar { Op } de sequelize al inicio)
const { Op } = require("sequelize");