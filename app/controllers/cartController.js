// app/controllers/cartController.js

const CartItem = require('../models/cartItemModel');
const Product = require('../models/productModel');
const User = require('../models/userModel'); // Asegúrate de que User esté importado
const sequelize = require('../config/database');

// ==========================================================
// 1. OBTENER ÍTEMS DEL CARRITO (MODIFICADO)
// ==========================================================
exports.getCartItems = async (req, res) => {
    try {
        // Obtenemos el ID del usuario desde el token (inyectado por authMiddleware)
        const userId = req.user.id; 

        // 1. Buscamos al usuario para obtener su balance
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // 2. Buscamos los ítems del carrito (como antes)
        const cartItems = await CartItem.findAll({
            where: { userId: userId },
            include: [{
                model: Product,
                attributes: ['name', 'price', 'imageUrl'] // Solo traemos los campos necesarios
            }]
        });

        // 3. Devolvemos AMBOS: los ítems y el balance
        res.status(200).json({
            cartItems: cartItems,
            userBalance: user.balance
        });

    } catch (error) {
        console.error("Error al obtener carrito:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

// ==========================================================
// 2. AÑADIR ÍTEM AL CARRITO (Sin cambios)
// ==========================================================
exports.addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; // Lo tomamos del token

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Stock insuficiente.` });
        }

        const existingItem = await CartItem.findOne({
            where: { productId: productId, userId: userId }
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            res.status(200).json(existingItem);
        } else {
            const newItem = await CartItem.create({
                productId: productId,
                userId: userId,
                quantity: quantity,
                price_at_purchase: product.price 
            });
            res.status(201).json(newItem);
        }
    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// ==========================================================
// 3. ELIMINAR ÍTEM (Sin cambios)
// ==========================================================
exports.removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

        const item = await CartItem.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ message: "Ítem no encontrado." });
        }
        if (item.userId !== userId) {
            return res.status(403).json({ message: "Acción no autorizada." });
        }

        await item.destroy();
        res.status(200).json({ message: "Ítem eliminado." });
    } catch (error) {
        console.error("Error al eliminar del carrito:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};


// ==========================================================
// 4. PROCESAR PAGO (Sin cambios, ya usaba el balance)
// ==========================================================
exports.processCheckout = async (req, res) => {
    const t = await sequelize.transaction(); 
    try {
        const userId = req.user.id; // Lo tomamos del token

        const user = await User.findByPk(userId, { transaction: t });
        const cartItems = await CartItem.findAll({
            where: { userId: userId },
            transaction: t
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." });
        }

        const totalCost = cartItems.reduce((sum, item) => {
            return sum + (Number(item.quantity) * Number(item.price_at_purchase));
        }, 0);

        // Agregamos el costo de envío fijo
        const shippingCost = 15.00;
        const finalTotalCost = totalCost + shippingCost;

        if (Number(user.balance) < finalTotalCost) {
            await t.rollback();
            return res.status(402).json({
                message: "Fondos insuficientes.",
                totalCost: finalTotalCost,
                userBalance: user.balance
            });
        }

        user.balance = Number(user.balance) - finalTotalCost;
        await user.save({ transaction: t });

        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId, { transaction: t });
            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}`);
            }
            product.stock -= item.quantity;
            await product.save({ transaction: t });
        }

        await CartItem.destroy({
            where: { userId: userId },
            transaction: t
        });

        await t.commit();
        res.status(200).json({ 
            message: "¡Compra exitosa! Créditos deducidos.",
            orderId: `FC2025-${Date.now()}`,
            newBalance: user.balance
        });
    } catch (error) {
        await t.rollback();
        console.error("Error durante el checkout:", error);
        res.status(500).json({ message: "Error al procesar el pago.", error: error.message });
    }
};