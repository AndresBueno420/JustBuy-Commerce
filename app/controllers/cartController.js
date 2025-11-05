// app/controllers/cartController.js

// Importamos los modelos que usaremos
const CartItem = require('../models/cartItemModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Importamos la conexión 'sequelize' para poder usar transacciones
const sequelize = require('../config/database');

exports.getCartItems = async (req, res) => {
    try {
        const userId = req.params;
        const cartItems = await CartItem.findAll({
            where: { userId: userId },
            // ¡IMPORTANTE! Usamos 'include' para traer los datos del producto asociado
            // Esto nos da el nombre, imagen y precio actual del producto en la misma consulta
            include: [{
                model: Product,
                attributes: ['name', 'price', 'imageUrl'] // Solo traemos los campos necesarios
            }]
        });

        res.status(200).json(cartItems);

    } catch (error) {
        console.error("Error al obtener carrito:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

exports.addItemToCart = async (req, res) => {
    try {
        // Obtenemos los datos del Front-end (jQuery/JS)
        const { productId, userId, quantity } = req.body;

        // 1. Verificar que el producto existe y obtener su precio
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }
        
        // 2. Verificar si hay stock suficiente
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Stock insuficiente. Solo quedan ${product.stock} unidades.` });
        }

        // 3. Verificar si el ítem YA existe en el carrito del usuario
        const existingItem = await CartItem.findOne({
            where: {
                productId: productId,
                userId: userId
            }
        });

        if (existingItem) {
            // Si ya existe, actualizamos la cantidad
            existingItem.quantity += quantity;
            // (Aquí también deberíamos re-verificar el stock total)
            await existingItem.save();
            res.status(200).json(existingItem);
        } else {
            // Si no existe, creamos un nuevo ítem en el carrito
            const newItem = await CartItem.create({
                productId: productId,
                userId: userId,
                quantity: quantity,
                // Guardamos el precio al momento de la compra (buena práctica)
                price_at_purchase: product.price 
            });
            res.status(201).json(newItem); // 201 = Creado
        }

    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.params; // Este es el ID del *CartItem*, no del producto

        const item = await CartItem.findByPk(itemId);

        if (!item) {
            return res.status(404).json({ message: "Ítem del carrito no encontrado." });
        }

        // (Aquí deberíamos verificar que el 'userId' del token coincida con el 'item.userId'
        // para seguridad, pero lo omitimos por simplicidad del MVP)

        await item.destroy(); // Elimina el registro de la tabla 'cart_items'

        res.status(200).json({ message: "Ítem eliminado del carrito exitosamente." });

    } catch (error) {
        console.error("Error al eliminar del carrito:", error);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

exports.processCheckout = async (req, res) => {
    
    // Iniciamos la transacción para asegurar que todo (pago y stock)
    // ocurra correctamente, o no ocurra nada.
    const t = await sequelize.transaction(); 

    try {
        // Asumimos que el ID del usuario viene del token de autenticación
        // (Por ahora lo tomamos del body por simplicidad)
        const { userId } = req.body; 

        // 1. Obtener el usuario Y sus ítems del carrito
        const user = await User.findByPk(userId, { transaction: t });
        const cartItems = await CartItem.findAll({
            where: { userId: userId },
            transaction: t
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." });
        }

        // ==========================================================
        // LÓGICA DE PAGO CON CRÉDITOS (REEMPLAZO DE LA SIMULACIÓN)
        // ==========================================================

        // 2. Calcular el costo total del pedido
        // (Usamos reduce para sumar el precio*cantidad de cada ítem)
        const totalCost = cartItems.reduce((sum, item) => {
            // Convertimos a Number para asegurar la suma decimal correcta
            return sum + (Number(item.quantity) * Number(item.price_at_purchase));
        }, 0);

        // 3. Verificar si el usuario tiene fondos suficientes
        if (Number(user.balance) < totalCost) {
            // Si no tiene fondos, revertimos la transacción (aunque no hicimos nada aún)
            await t.rollback(); 
            return res.status(402).json({ // 402 = Payment Required (pero fallido)
                message: "Fondos insuficientes.",
                totalCost: totalCost,
                userBalance: user.balance
            });
        }

        // 4. Si tiene fondos, DEDUCIR el costo del balance del usuario
        user.balance = Number(user.balance) - totalCost;
        await user.save({ transaction: t }); // Guardamos el nuevo balance del usuario

        // ==========================================================
        // FIN DE LA LÓGICA DE PAGO
        // ==========================================================

        // 5. Actualizar el stock de los productos (como antes)
        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId, { transaction: t });
            
            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para el producto ${product.name}`);
            }
            product.stock -= item.quantity;
            await product.save({ transaction: t });
        }

        // 6. Vaciar el carrito del usuario (como antes)
        await CartItem.destroy({
            where: { userId: userId },
            transaction: t
        });

        // 7. Si todo salió bien, confirmamos la transacción (Commit)
        await t.commit();

        // 8. Enviar respuesta de éxito
        res.status(200).json({ 
            message: "¡Compra exitosa! Créditos deducidos.",
            orderId: `FC2025-${Date.now()}`,
            newBalance: user.balance // Enviamos el nuevo balance al front-end
        });

    } catch (error) {
        // 9. Si algo falló (ej. stock), revertimos (Rollback) la transacción
        await t.rollback();
        console.error("Error durante el checkout:", error);
        res.status(500).json({ message: "Error al procesar el pago.", error: error.message });
    }
};
