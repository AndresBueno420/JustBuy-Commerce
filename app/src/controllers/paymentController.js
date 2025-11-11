// Archivo: src/controllers/paymentController.js

const client = require('../config/mercadopago');
const { Preference } = require('mercadopago');
const { Cart, CartItem, Product, Order, OrderItem } = require('../models');
const { Payment } = require('mercadopago');

exports.createPreference = async (req, res) => {
  try {
    const userId = req.session.userId;
    const cart = await Cart.findOne({ where: { UserId: userId } });
    const cartItems = await CartItem.findAll({
      where: { CartId: cart.id },
      include: [Product]
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // --- 1. Crear el Pedido (Order) en nuestra BD ---
    let total = 0;
    cartItems.forEach(item => {
      total += item.quantity * item.Product.price;
    });

    const order = await Order.create({
      UserId: userId,
      totalAmount: total,
      status: 'pending' // El webhook lo cambiará a 'approved'
    });

    // --- 2. Mover items del Carrito a OrderItem ---
    const orderItemsData = cartItems.map(item => {
      return {
        OrderId: order.id,
        ProductId: item.ProductId,
        quantity: item.quantity,
        price: item.Product.price // Guardar el precio de ese momento
      }
    });
    await OrderItem.bulkCreate(orderItemsData);

    // --- 3. Vaciar el carrito ---
    // (Ya no lo necesitamos, se movió al pedido)
    await CartItem.destroy({ where: { CartId: cart.id } });

    // --- 4. Preparar datos para Mercado Pago ---
    const preferenceItems = cartItems.map(item => ({
      title: item.Product.name,
      unit_price: Math.round(Number(item.Product.price) * 100),
      quantity: Number(item.quantity),
    }));

    const host = 'http://localhost:3000'; // El front sigue en localhost

    const preferenceData = {
      items: preferenceItems,
      back_urls: {
        success: `${host}/success.html`,
        failure: `${host}/cart.html`,
        pending: `${host}/cart.html`,
      },
      // --- ¡¡MUY IMPORTANTE!! ---
      // Enviamos el ID de nuestro pedido a Mercado Pago
      external_reference: order.id.toString(), 
      
      // La URL del webhook que nos dio ngrok
      notification_url: `https://d3ffa860181d.ngrok-free.app/api/payment/webhook` 
    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData });

    res.status(201).json({ init_point: response.init_point });

  } catch (error) {
    console.error('❌ Error completo:', error);
    res.status(500).json({ 
      message: 'Error al crear la preferencia de pago', 
      error: error.message,
      details: error.cause || error.response?.data // Info adicional de MP
    });
  }
};

exports.receiveWebhook = async (req, res) => {
  console.log('Webhook recibido:', req.body);
  
  const { data, type } = req.body;

  if (type === 'payment') {
    try {
      // 1. Obtener el pago desde Mercado Pago
      const paymentService = new Payment(client);
      const payment = await paymentService.get({ id: data.id });
      
      console.log('Datos del pago:', payment);

      // 2. Obtener nuestro ID de Pedido (el que guardamos)
      const orderId = payment.external_reference;
      
      // 3. Si el pago fue aprobado, actualizamos nuestro pedido
      if (payment.status === 'approved' && orderId) {
        
        const order = await Order.findByPk(orderId);
        
        if (order) {
          order.status = 'approved';
          order.paymentId = payment.id.toString(); // Guardar el ID de MP
          await order.save();
          console.log(`Pedido ${orderId} marcado como 'approved'.`);
        }
      }
      
    } catch (error) {
      console.error('Error al procesar webhook:', error);
      return res.status(500).json({ message: 'Error en webhook' });
    }
  }

  // 4. Responder 200 OK (como dice tu imagen)
  // Esto le dice a Mercado Pago que lo recibimos.
  res.status(200).send('OK');
};