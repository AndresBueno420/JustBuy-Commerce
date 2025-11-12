const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: { // Guardamos el precio al momento de la compra
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // OrderId y ProductId se añadirán por asociación
});

module.exports = OrderItem;