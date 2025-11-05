// app/models/userModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a RDS


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
    balance: {
        type: DataTypes.DECIMAL(10, 2), // Formato para moneda (ej. 1000.00)
        allowNull: false,
        defaultValue: 300.00 // Asigna 300 dólares a los nuevos usuarios
    }

}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;