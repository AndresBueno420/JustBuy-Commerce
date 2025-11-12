const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  // El ID del usuario se añadirá automáticamente por la asociación
});

module.exports = Cart;