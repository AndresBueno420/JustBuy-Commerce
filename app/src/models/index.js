const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// --- Definir Relaciones ---

// 1. Usuario y Carrito (Uno a Uno)
User.hasOne(Cart);
Cart.belongsTo(User);

// 2. Carrito y Productos (Muchos a Muchos, a través de CartItem)
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// (Opcional pero recomendado para acceder directo a CartItem)
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

Product.hasMany(CartItem);
CartItem.belongsTo(Product);

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// --- Exportar todo ---
module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
  Order,     // <--- Añadir
  OrderItem, // <--- Añadir
};