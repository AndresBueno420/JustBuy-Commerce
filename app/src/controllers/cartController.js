const { Cart, CartItem, Product, Order, OrderItem } = require('../models');

// Obtener el carrito del usuario logueado
exports.getCart = async (req, res) => {
  try {
    // 1. Encontrar el carrito del usuario
    const cart = await Cart.findOne({ where: { UserId: req.session.userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // 2. Encontrar todos los items de ese carrito, incluyendo la info del producto
    const cartItems = await CartItem.findAll({
      where: { CartId: cart.id },
      include: [Product] // ¡La magia de Sequelize! Trae los datos del producto asociado
    });

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

// Añadir un producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;

    // 1. Encontrar el carrito del usuario
    const cart = await Cart.findOne({ where: { UserId: userId } });

    // 2. Revisar si el item ya está en el carrito
    let item = await CartItem.findOne({
      where: {
        CartId: cart.id,
        ProductId: productId
      }
    });

    if (item) {
      // Si existe, actualizar la cantidad
      item.quantity += (quantity || 1);
      await item.save();
    } else {
      // Si no existe, crearlo
      item = await CartItem.create({
        CartId: cart.id,
        ProductId: productId,
        quantity: (quantity || 1)
      });
    }
    
    res.status(200).json({ message: 'Producto añadido al carrito', item });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir producto al carrito', error: error.message });
  }
};

// Eliminar un item del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params; // Este es el ID del CartItem
    const userId = req.session.userId;

    // 1. Encontrar el carrito del usuario (para seguridad)
    const cart = await Cart.findOne({ where: { UserId: userId } });

    // 2. Encontrar el item específico en el carrito del usuario
    const item = await CartItem.findOne({
      where: {
        id: itemId,
        CartId: cart.id // Aseguramos que el item pertenezca al carrito del usuario
      }
    });

    if (item) {
      // 3. Si existe, eliminarlo
      await item.destroy();
      res.status(200).json({ message: 'Item eliminado del carrito' });
    } else {
      res.status(404).json({ message: 'Item no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el item', error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.session.userId },
      order: [['createdAt', 'DESC']], // Más recientes primero
      include: [
        {
          model: OrderItem,
          include: [Product] // Cargar los productos de cada item
        }
      ]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};