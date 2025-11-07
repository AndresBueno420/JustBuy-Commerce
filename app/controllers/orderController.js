// app/controllers/orderController.js
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Product = require('../models/productModel');

exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId: userId },
            // Ordenar por más reciente primero
            order: [['createdAt', 'DESC']],
            // Incluir los ítems Y los productos dentro de los ítems
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['name', 'imageUrl'] // Solo traer lo necesario
                }]
            }]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error al obtener historial de órdenes:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};