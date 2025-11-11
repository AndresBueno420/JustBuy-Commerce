const express = require('express');
const session = require('express-session');
const path = require('path');
// sequelize ya no se importa de config, sino de models/index.js
const { sequelize } = require('./src/models'); 
require('dotenv').config();

// --- IMPORTAR RUTAS ---
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/product'); // <--- AÑADIR
const cartRoutes = require('./src/routes/cart');       // <--- AÑADIR
const paymentRoutes = require('./src/routes/payment');
const { isAuthenticated } = require('./src/middleware/auth');


const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuración de Middleware ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// --- USAR RUTAS ---
app.use('/auth', authRoutes); 
app.use('/api', productRoutes); // <--- AÑADIR
app.use('/api', cartRoutes);    // <--- AÑADIR
app.use('/api', paymentRoutes);
// (Usaremos las rutas /api en Fase 3)
// const productRoutes = require('./src/routes/product');
// const cartRoutes = require('./src/routes/cart');
// const { isAuthenticated } = require('./src/middleware/auth');
//
// app.use('/api', isAuthenticated, productRoutes);
// app.use('/api', isAuthenticated, cartRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- Arranque del Servidor ---
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a Postgres establecida exitosamente.');
    
    // --- SINCRONIZAR MODELOS ---
    // Usamos { alter: true } para actualizar tablas sin borrar datos (más seguro que 'force: true')
    await sequelize.sync({ alter: true }); 
    console.log('✅ Modelos (User, Product, Cart, CartItem) sincronizados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar o sincronizar la base de datos:', error);
  }
}

startServer();