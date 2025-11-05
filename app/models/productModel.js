const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la conexión a RDS

// Define el modelo "Product"
const Product = sequelize.define('Product', {
    // ID será la clave primaria, generada automáticamente
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Nombre de la camiseta (e.g., "Real Madrid - Local 23/24")
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Descripción completa (para la página product.html)
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Precio del producto
    price: {
        type: DataTypes.DECIMAL(10, 2), // Formato para moneda (hasta 10 dígitos, 2 decimales)
        allowNull: false
    },
    // Cantidad disponible en stock
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0 // Asume que inicialmente no hay stock si no se especifica
    },
    // URL de la imagen principal (para el catálogo)
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    // Opciones del modelo
    tableName: 'products', // Nombre real de la tabla en RDS
    timestamps: true       // Sequelize añade campos 'createdAt' y 'updatedAt'
});

// Sincroniza el modelo con la base de datos (crea la tabla si no existe)
Product.sync({ alter: true }); // Usamos 'alter: true' para modificar la tabla si ya existe sin perder datos

module.exports = Product;