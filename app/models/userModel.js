// app/models/userModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a RDS

// Se recomienda usar una librería de hashing como 'bcrypt' para las contraseñas
// const bcrypt = require('bcrypt'); // (Necesitarías instalarla en package.json) 

// Define el modelo "User"
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Correo electrónico (debe ser único)
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Valida que el formato sea de correo
        }
    },
    // Nombre de usuario (opcional, pero útil)
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Contraseña (IMPORTANTE: Siempre debe ser hasheada, NO texto plano)
    password: {
        type: DataTypes.STRING, // Guardará el hash de la contraseña
        allowNull: false
    },
}, {
    tableName: 'users',
    timestamps: true
});

// ***************************************************************
// Lógica de Seguridad (Hooks de Sequelize)
// ***************************************************************
/* Este código se ejecutaría ANTES de guardar el usuario y hashearía la contraseña.
   Esto es crucial para cumplir con los principios de seguridad del proyecto.
   
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});
*/

// Sincroniza el modelo con la base de datos
User.sync({ alter: true });

module.exports = User;