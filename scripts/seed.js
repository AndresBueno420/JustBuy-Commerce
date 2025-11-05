// scripts/seed.js

const sequelize = require('../app/config/database'); 

// 1. IMPORTAR TODOS LOS MODELOS
// Necesitamos importar todos los modelos para que sequelize.sync() conozca toda la estructura.
require('../app/models/userModel'); 
const Product = require('../app/models/productModel'); 
require('../app/models/cartItemModel');

// --- DATOS DE EJEMPLO DE CAMISETAS ---
const productsToSeed = [
    {
        name: 'Real Madrid - Local 23/24',
        description: 'Camiseta oficial de local del Real Madrid, temporada 2023-2024. Tecnología Aeroready para máxima comodidad.',
        price: 100.00,
        stock: 50,
        imageUrl: '/img/real-madrid-local.jpg'
    },
    {
        name: 'FC Barcelona - Visitante 23/24',
        description: 'Camiseta de visitante del FC Barcelona, color blanco. Tecnología Dri-FIT que absorbe el sudor.',
        price: 95.00,
        stock: 40,
        imageUrl: '/img/barca-visitante.jpg'
    },
    {
        name: 'Manchester United - Local 23/24',
        description: 'Camiseta de local del Manchester United. Diseño clásico rojo con detalles modernos.',
        price: 98.00,
        stock: 30,
        imageUrl: '/img/man-utd-local.jpg'
    },
    {
        name: 'Liverpool FC - Local 23/24',
        description: 'Camiseta roja de local del Liverpool FC, temporada 2023-2024. Escudo bordado.',
        price: 97.00,
        stock: 35,
        imageUrl: '/img/liverpool-local.jpg'
    }
];

/**
 * Función asíncrona para poblar la base de datos.
 */
const seedDatabase = async () => {
    try {
        // 1. Autenticar la conexión
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');

        // 2. Sincronizar TODOS los modelos
        // Usamos { force: true } para borrar y recrear TODAS las tablas (User, Product, CartItem)
        // Esto es destructivo, pero es lo que se espera de un script de "seeding".
        console.log('Sincronizando todos los modelos (force: true)...');
        await sequelize.sync({ force: true }); 
        console.log('Todas las tablas han sido recreadas.');

        // 3. Insertar los datos (solo en la tabla Product)
        console.log('Insertando productos de ejemplo...');
        await Product.bulkCreate(productsToSeed);
        console.log(`¡Éxito! Se insertaron ${productsToSeed.length} productos en la base de datos.`);

    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
    } finally {
        // 4. Cerrar la conexión
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
};

// 5. Ejecutar la función de seeding
seedDatabase();