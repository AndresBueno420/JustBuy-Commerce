const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const CartItem = sequelize.define('CartItem', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    // Precio al momento de agregar (útil si el precio cambia después)
    price_at_purchase: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
}, {
    tableName: 'cart_items',
    timestamps: true
});

// Importar los modelos principales para definir las relaciones
const User = require('./userModel');
const Product = require('./productModel');

// Definir las Relaciones
// Un usuario tiene muchos ítems en el carrito
User.belongsToMany(Product, { through: CartItem, foreignKey: 'userId' });

// Un producto está en muchos carritos (ítems)
Product.belongsToMany(User, { through: CartItem, foreignKey: 'productId' });

CartItem.sync({ alter: true });

module.exports = CartItem;