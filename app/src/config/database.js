const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga las variables de .env

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const nodeEnv = process.env.NODE_ENV; // 'production' en AWS

let dbOptions = {
  host: dbHost,
  dialect: 'postgres',
  logging: false,
};

if (nodeEnv === 'production') {
  dbOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(dbName, dbUser, dbPass, dbOptions);

module.exports = sequelize;