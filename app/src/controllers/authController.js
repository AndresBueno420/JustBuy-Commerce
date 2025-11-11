const { User, Cart } = require('../models');

// 1. Registrar un usuario
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    // Crear el nuevo usuario (la contraseña se hashea automáticamente por el hook)
    const user = await User.create({ email, password });

    // ¡Importante! Crear un carrito vacío para el nuevo usuario
    await Cart.create({ UserId: user.id });

    // (Opcional) Iniciar sesión automáticamente después de registrar
    req.session.userId = user.id;

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

// 2. Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña (usando el método que creamos en el modelo)
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Guardar el ID de usuario en la sesión
    req.session.userId = user.id;

    res.status(200).json({ message: 'Inicio de sesión exitoso', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// 3. Cerrar sesión
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    // Redirige al inicio (o simplemente envía OK)
    res.status(200).json({ message: 'Sesión cerrada' });
    // En el frontend, redirigiremos a index.html
  });
};