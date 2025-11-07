// app/models/orderItemModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./orderModel');
const Product = require('./productModel');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Guardamos el precio del producto en ese momento
    price_at_purchase: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
    // 'orderId' y 'productId' se añaden por las asociaciones
}, {
    tableName: 'order_items',
    timestamps: false // No necesitamos timestamps para los ítems
});

// Definir Relaciones
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = OrderItem;