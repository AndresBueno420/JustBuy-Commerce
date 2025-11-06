// app/models/cartItemModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const User = require('./userModel');
const Product = require('./productModel');

const CartItem = sequelize.define('CartItem', {
    id: { // Añadimos un ID simple para facilitar el borrado
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price_at_purchase: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
}, {
    tableName: 'cart_items',
    timestamps: true
});

// ==========================================================
// DEFINICIÓN DE ASOCIACIONES (¡AQUÍ ESTÁ LA CORRECCIÓN!)
// ==========================================================

// Un ítem del carrito PERTENECE A un usuario
CartItem.belongsTo(User, { foreignKey: 'userId' });
// Un usuario PUEDE TENER MUCHOS ítems de carrito
User.hasMany(CartItem, { foreignKey: 'userId' });

// Un ítem del carrito PERTENECE A un producto
CartItem.belongsTo(Product, { foreignKey: 'productId' });
// Un producto PUEDE ESTAR EN MUCHOS ítems de carrito
Product.hasMany(CartItem, { foreignKey: 'productId' });


// (Eliminamos el .sync() de aquí, como acordamos)
module.exports = CartItem;