// Archivo: src/config/mercadopago.js

const { MercadoPagoConfig } = require('mercadopago'); // Importamos el Constructor
require('dotenv').config();

// Creamos un cliente con nuestras credenciales
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Exportamos el cliente configurado
module.exports = client;