// app/controllers/productsController.js

const Product = require('../models/productModel');
const { Op } = require('sequelize'); // ¡Importante! Requerimos los Operadores de Sequelize

// ==========================================================
// 1. OBTENER TODOS LOS PRODUCTOS (¡AHORA CON BÚSQUEDA!)
// ==========================================================
exports.getAllProducts = async (req, res) => {
    
    try {
        // 1. Revisar si hay un query parameter 'q' en la URL
        const { q } = req.query;

        let options = {
            order: [['name', 'ASC']]
        };

        // 2. Si hay un término de búsqueda 'q', modificar las opciones
        if (q) {
            options.where = {
                name: {
                    // [Op.iLike] (solo en PostgreSQL) es "case-insensitive" (ignora may/min)
                    // [Op.like] (en MySQL) es sensible por defecto
                    // Usamos iLike asumiendo PostgreSQL en RDS, que es más robusto para búsqueda.
                    [Op.iLike]: `%${q}%` // Busca cualquier producto que CONTENGA el término
                }
            };
        }

        // 3. Consultar la base de datos con las opciones (filtradas o no)
        const products = await Product.findAll(options);

        // 4. Enviar la respuesta
        res.status(200).json(products);

    } catch (error) {
        // 5. Manejo de Errores
        console.error("Error al obtener productos:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al consultar la base de datos.", 
            error: error.message 
        });
    }
};

// ==========================================================
// 2. OBTENER UN PRODUCTO POR ID (Se mantiene igual)
// ==========================================================
exports.getProductById = async (req, res) => {
    
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }
        res.status(200).json(product);

    } catch (error) {
        console.error(`Error al obtener producto por ID (${req.params.id}):`, error);
        res.status(500).json({ 
            message: "Error interno del servidor.", 
            error: error.message 
        });
    }
};