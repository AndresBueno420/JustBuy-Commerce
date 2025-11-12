const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { sequelize, Product } = require('../models');

const productsToSeed = [
  {
    name: 'Real Madrid - Local 23/24',
    description: 'Camiseta oficial de local del Real Madrid, temporada 2023-2024. Tecnología Aeroready para máxima comodidad.',
    price: 200000,
    imageUrl: '/img/real-madrid-local.jpg'
  },
  {
    name: 'FC Barcelona - Visitante 23/24',
    description: 'Camiseta de visitante del FC Barcelona, color blanco. Tecnología Dri-FIT que absorbe el sudor.',
    price: 195000,
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

const runSeed = async () => {
  try {
    await sequelize.sync({ force: true }); // Sincroniza la BD
    console.log('Sincronización de BD completa.');

    // Limpiar productos existentes
    await Product.destroy({ where: {} });
    console.log('Productos antiguos eliminados.');

    // Insertar nuevos productos
    await Product.bulkCreate(productsToSeed);
    console.log('✅ ¡Productos de prueba insertados exitosamente!');

  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
};

runSeed();