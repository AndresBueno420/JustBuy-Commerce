// Middleware para verificar si el usuario está autenticado
exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    // Si hay un userId en la sesión, el usuario está logueado
    return next();
  } else {
    // Si no, devolver un error 401 (No autorizado)
    return res.status(401).json({ message: 'Acceso no autorizado. Por favor, inicie sesión.' });
  }
};