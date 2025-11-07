// app/models/orderModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Almacenamos el total final (incluyendo envío)
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shippingAddress: {
        type: DataTypes.STRING,
        allowNull: true // Hacemos la dirección opcional por ahora
    }
    // El 'userId' se añadirá automáticamente por la asociación
}, {
    tableName: 'orders',
    timestamps: true // Guarda 'createdAt' y 'updatedAt'
});

// Definir la Relación: Un Usuario tiene MUCHOS Pedidos
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;