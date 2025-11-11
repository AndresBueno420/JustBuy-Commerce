const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga las variables de .env

// Creamos la instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Desactiva el logging de SQL en consola
  }
);

module.exports = sequelize;