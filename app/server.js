// server.js

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde .env (para DB y Puertos)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear cuerpos de solicitud JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------------------
// 1. Servir Archivos Estáticos (EL FRONT-END)
// Express sirve todos los archivos de la carpeta 'public'
// Esto permite que el navegador acceda a index.html, styles.css, etc.
// ----------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------
// 2. Importar Rutas de la API
// Aquí se conectarán nuestros endpoints (productRoutes, authRoutes)
// ----------------------------------------------------
// const productRoutes = require('./routes/productRoutes');
// app.use('/api', productRoutes); 
// EJEMPLO: Esto hará que la ruta sea http://localhost:3000/api/products

// Nota: Las rutas se agregarán en la siguiente fase.

// ----------------------------------------------------
// 3. Prueba de Conexión a la Base de Datos (RDS)
// ----------------------------------------------------
const sequelize = require('./config/database'); 
sequelize.authenticate()
  .then(() => console.log('Conexión a AWS RDS establecida exitosamente.'))
  .catch(err => console.error('Error al conectar a AWS RDS:', err.message));


// ----------------------------------------------------
// 4. Iniciar el Servidor
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`\nServidor Express corriendo en http://localhost:${PORT}`);
  console.log(`Accede al Front-end en: http://localhost:${PORT}/index.html`);
  console.log('\n¡Listo para la implementación IaC en AWS!\n');
});

// Exportar 'app' para pruebas (opcional)
module.exports = app;